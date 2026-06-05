// Admin detection + (optional) first-admin bootstrap.
//
// Detection uses the user's own authenticated Supabase client (RLS policy
// "Users can read their own roles" allows this). This works WITHOUT any
// service role key, so VPS deployments that only ship the publishable key
// can still log into /admin.
//
// First-admin auto-claim requires SUPABASE_SERVICE_ROLE_KEY (because
// INSERT into user_roles is restricted to existing admins). If the key is
// missing we silently skip the claim — detection still returns correctly.
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // 1) Am I already an admin? (uses caller's session — no service role needed)
    const { data: mine, error: mineErr } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (mineErr) throw new Error(mineErr.message);
    if (mine) return { is_admin: true, claimed: false };

    // 2) Not an admin yet. Try first-admin bootstrap via service role.
    //    If service role key is unavailable (e.g. VPS without it), just
    //    report is_admin=false without failing the whole request.
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { is_admin: false, claimed: false };
    }

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { count, error: cErr } = await supabaseAdmin
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");
      if (cErr) throw new Error(cErr.message);
      if ((count ?? 0) > 0) {
        // Admins exist, just not me.
        return { is_admin: false, claimed: false };
      }
      const { error } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (error) throw new Error(error.message);
      return { is_admin: true, claimed: true };
    } catch (e) {
      console.error("[claimFirstAdmin] bootstrap skipped:", (e as Error).message);
      return { is_admin: false, claimed: false };
    }
  });
