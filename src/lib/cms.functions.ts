// Public CMS reads. Uses admin client to bypass RLS for SSR-safe public reads,
// but always filters to is_visible = true and returns only safe fields.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type ProductCard = {
  id: string;
  slug: string;
  title: string;
  tag: string | null;
  short_desc: string | null;
  hero_image_url: string | null;
  sort_order: number;
};

export type ProductFull = ProductCard & {
  long_content: Record<string, unknown>;
};

export type CaseCard = {
  id: string;
  slug: string;
  title: string;
  tag: string | null;
  cover_image_url: string | null;
  summary: string | null;
  sort_order: number;
};

export type CaseFull = CaseCard & {
  details: Record<string, unknown>;
};

export const listProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProductCard[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, slug, title, tag, short_desc, hero_image_url, sort_order")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as ProductCard[];
  },
);

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(100) }).parse(d))
  .handler(async ({ data }): Promise<ProductFull | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("products")
      .select("id, slug, title, tag, short_desc, hero_image_url, sort_order, long_content")
      .eq("slug", data.slug)
      .eq("is_visible", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row as ProductFull | null);
  });

export const listCases = createServerFn({ method: "GET" }).handler(
  async (): Promise<CaseCard[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("cases")
      .select("id, slug, title, tag, cover_image_url, summary, sort_order")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as CaseCard[];
  },
);

export const getCaseBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(100) }).parse(d))
  .handler(async ({ data }): Promise<CaseFull | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("cases")
      .select("id, slug, title, tag, cover_image_url, summary, sort_order, details")
      .eq("slug", data.slug)
      .eq("is_visible", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row as CaseFull | null;
  });

export const getSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<Record<string, Record<string, unknown>>> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from("site_settings").select("key, value");
    if (error) throw new Error(error.message);
    const out: Record<string, Record<string, unknown>> = {};
    for (const row of data ?? []) out[row.key as string] = (row.value as Record<string, unknown>) ?? {};
    return out;
  },
);
