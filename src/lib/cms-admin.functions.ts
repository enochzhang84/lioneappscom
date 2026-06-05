// Admin CMS writes. All require auth + admin role.
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

async function ensureAdmin(supabase: SupabaseClient<Database>, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

const slug = z.string().min(1).max(80).regex(/^[a-z0-9-]+$/, "slug 只能小写字母数字和短横线");

// ---------- Products ----------
export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGetProduct = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase.from("products").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

const productInput = z.object({
  id: z.string().uuid().optional(),
  slug,
  title: z.string().min(1).max(120),
  tag: z.string().max(60).nullable().optional(),
  short_desc: z.string().max(500).nullable().optional(),
  hero_image_url: z.string().max(500).nullable().optional(),
  long_content: z.record(z.string(), z.any()).default({}),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});

export const adminUpsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => productInput.parse(d))
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.supabase, context.userId);
    if (data.id) {
      const { error } = await context.supabase.from("products").update({
        slug: data.slug, title: data.title, tag: data.tag ?? null,
        short_desc: data.short_desc ?? null, hero_image_url: data.hero_image_url ?? null,
        long_content: data.long_content, sort_order: data.sort_order, is_visible: data.is_visible,
      }).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: row, error } = await context.supabase.from("products").insert({
      slug: data.slug, title: data.title, tag: data.tag ?? null,
      short_desc: data.short_desc ?? null, hero_image_url: data.hero_image_url ?? null,
      long_content: data.long_content, sort_order: data.sort_order, is_visible: data.is_visible,
    }).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminToggleProductVisibility = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; is_visible: boolean }) =>
    z.object({ id: z.string().uuid(), is_visible: z.boolean() }).parse(d))
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("products").update({ is_visible: data.is_visible }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminMoveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; sort_order: number }) =>
    z.object({ id: z.string().uuid(), sort_order: z.number().int() }).parse(d))
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("products").update({ sort_order: data.sort_order }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Cases ----------
export const adminListCases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase.from("cases").select("*").order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGetCase = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase.from("cases").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

const caseInput = z.object({
  id: z.string().uuid().optional(),
  slug,
  title: z.string().min(1).max(120),
  tag: z.string().max(60).nullable().optional(),
  cover_image_url: z.string().max(500).nullable().optional(),
  summary: z.string().max(500).nullable().optional(),
  details: z.record(z.string(), z.any()).default({}),
  sort_order: z.number().int().default(0),
  is_visible: z.boolean().default(true),
});

export const adminUpsertCase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => caseInput.parse(d))
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.supabase, context.userId);
    if (data.id) {
      const { error } = await context.supabase.from("cases").update({
        slug: data.slug, title: data.title, tag: data.tag ?? null,
        cover_image_url: data.cover_image_url ?? null, summary: data.summary ?? null,
        details: data.details, sort_order: data.sort_order, is_visible: data.is_visible,
      }).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: row, error } = await context.supabase.from("cases").insert({
      slug: data.slug, title: data.title, tag: data.tag ?? null,
      cover_image_url: data.cover_image_url ?? null, summary: data.summary ?? null,
      details: data.details, sort_order: data.sort_order, is_visible: data.is_visible,
    }).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });

export const adminDeleteCase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("cases").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminToggleCaseVisibility = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; is_visible: boolean }) =>
    z.object({ id: z.string().uuid(), is_visible: z.boolean() }).parse(d))
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("cases").update({ is_visible: data.is_visible }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminMoveCase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; sort_order: number }) =>
    z.object({ id: z.string().uuid(), sort_order: z.number().int() }).parse(d))
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("cases").update({ sort_order: data.sort_order }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Settings ----------
export const adminListSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from("site_settings").select("key, value");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpsertSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { key: string; value: Record<string, unknown> }) =>
    z.object({
      key: z.string().min(1).max(60).regex(/^[a-z0-9_]+$/),
      value: z.record(z.string(), z.any()),
    }).parse(d))
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("site_settings").upsert({ key: data.key, value: data.value });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Image upload ----------
// Accepts base64 data URI and uploads to private bucket; returns the storage key
// which gets stored in *_image_url columns. Public proxy serves it via /api/public/media/{key}.
export const adminUploadImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { filename: string; data_url: string; folder?: string }) =>
    z.object({
      filename: z.string().min(1).max(200),
      data_url: z.string().min(20).max(15_000_000),
      folder: z.string().max(40).regex(/^[a-z0-9_-]+$/).optional(),
    }).parse(d))
  .handler(async ({ context, data }) => {
    await ensureAdmin(context.userId);
    const m = /^data:([a-zA-Z0-9/+.-]+);base64,(.*)$/.exec(data.data_url);
    if (!m) throw new Error("Invalid data URL");
    const contentType = m[1];
    const buf = Buffer.from(m[2], "base64");
    const ext = (data.filename.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6);
    const folder = data.folder || "uploads";
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage.from("site-media").upload(key, buf, {
      contentType, upsert: false,
    });
    if (error) throw new Error(error.message);
    return { key, url: `/api/public/media/${key}` };
  });
