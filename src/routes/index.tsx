import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { listProducts, getSettings, type ProductCard } from "@/lib/cms.functions";
import { mediaUrl } from "@/lib/media";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lione Apps — 专属管理平台开发" },
      { name: "description", content: "为教会、组织与小型企业打造专属管理平台与业务系统。" },
      { property: "og:title", content: "Lione Apps — 专属管理平台开发" },
      { property: "og:description", content: "为教会、组织与小型企业打造专属管理平台与业务系统。" },
    ],
  }),
  loader: async () => {
    const [products, settings] = await Promise.all([listProducts(), getSettings()]);
    return { products, settings };
  },
  component: Home,
});

function Home() {
  const { products, settings } = Route.useLoaderData();
  const hero = (settings.hero ?? {}) as { title?: string; subtitle?: string; cta_primary?: string; cta_secondary?: string };
  const contact = (settings.contact ?? {}) as { email?: string };

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{ background: "radial-gradient(60% 50% at 50% 0%, oklch(0.55 0.22 264 / 0.18), transparent 70%)" }}
        />
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-12 md:pt-24 md:pb-14 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">{hero.title || "Lione Apps"}</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {hero.subtitle || "为教会、组织与小型企业打造专属管理平台"}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <a href="#products">{hero.cta_primary || "查看产品"} <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">{hero.cta_secondary || "联系咨询"}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-6xl px-6 pb-20">
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">还没有发布的产品。</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {(products as ProductCard[]).map((p) => {
              const img = mediaUrl(p.hero_image_url);
              return (
                <Link
                  key={p.id}
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)] hover:border-primary/30"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-secondary grid place-items-center">
                    {img ? (
                      <img src={img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <span className="text-4xl font-bold text-muted-foreground/40">{p.title.slice(0, 2)}</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {p.tag && (
                      <span className="self-start rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {p.tag}
                      </span>
                    )}
                    <h3 className="mt-3 text-xl font-semibold">{p.title}</h3>
                    {p.short_desc && <p className="mt-1.5 text-sm text-muted-foreground">{p.short_desc}</p>}
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      查看详情 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-[var(--shadow-card)] text-center">
          <h2 className="text-2xl md:text-3xl font-bold">想了解更多？</h2>
          <p className="mt-2 text-muted-foreground">告诉我们您的需求，我们会尽快回复。</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/contact"><MessageCircle className="mr-1 h-4 w-4" />在线表单</Link>
            </Button>
            {contact.email && (
              <Button asChild size="lg" variant="outline">
                <a href={`mailto:${contact.email}`}><Mail className="mr-1 h-4 w-4" />{contact.email}</a>
              </Button>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
