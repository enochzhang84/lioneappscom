// Admin detection + first-admin bootstrap.
// Uses the signed-in user's session and database RLS, so it does not require
// SUPABASE_SERVICE_ROLE_KEY on VPS deployments.
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

    // 2) Not an admin yet. Attempt first-admin bootstrap as the current user.
    // RLS + trigger allow this only when no admin exists; otherwise it fails.
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (error) return { is_admin: false, claimed: false };
      return { is_admin: true, claimed: true };
    } catch (e) {
      console.error("[claimFirstAdmin] bootstrap skipped:", (e as Error).message);
      return { is_admin: false, claimed: false };
    }
  });
