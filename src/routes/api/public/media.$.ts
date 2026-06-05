// Public image proxy. Streams files from the private "site-media" bucket
// without exposing service-role URLs. Path: /api/public/media/<storage-key>
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const key = (params as { _splat?: string })._splat ?? "";
        if (!key || key.includes("..")) return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("site-media").download(key);
        if (error || !data) return new Response("Not found", { status: 404 });
        const ab = await data.arrayBuffer();
        const ext = key.split(".").pop()?.toLowerCase();
        const type =
          ext === "png" ? "image/png" :
          ext === "webp" ? "image/webp" :
          ext === "gif" ? "image/gif" :
          ext === "svg" ? "image/svg+xml" :
          ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
          (data as Blob).type || "application/octet-stream";
        return new Response(ab, {
          status: 200,
          headers: {
            "content-type": type,
            "cache-control": "public, max-age=300, s-maxage=3600",
          },
        });
      },
    },
  },
});
