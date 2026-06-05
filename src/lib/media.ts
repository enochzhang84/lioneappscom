// Resolve a stored image value to a usable URL.
// Accepts: full http(s) URL, /api/... path, storage key like "products/abc.jpg".
export function mediaUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const v = value.trim();
  if (!v) return null;
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  if (v.startsWith("/")) return v;
  return `/api/public/media/${v.replace(/^\/+/, "")}`;
}
