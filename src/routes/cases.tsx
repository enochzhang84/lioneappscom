import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { listCases } from "@/lib/cms.functions";
import { mediaUrl } from "@/lib/media";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/cases")({
  head: () => ({
    meta: [
      { title: "项目案例 — Lione Apps" },
      { name: "description", content: "查看 Lione Apps 已完成的项目案例。" },
    ],
  }),
  loader: async () => ({ cases: await listCases() }),
  component: CasesPage,
});

function CasesPage() {
  const { cases } = Route.useLoaderData();
  return (
    <SiteLayout>
      <PageHero eyebrow="案例" title="项目案例" desc="一些已交付的代表性项目。" />
      <section className="mx-auto max-w-6xl px-6 py-12">
        {cases.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">还没有发布的案例。</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {cases.map((c) => {
              const img = mediaUrl(c.cover_image_url);
              return (
                <Link
                  key={c.id}
                  to="/cases/$slug"
                  params={{ slug: c.slug }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/30"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-secondary grid place-items-center">
                    {img ? <img src={img} alt={c.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                         : <span className="text-3xl text-muted-foreground/40">{c.title.slice(0, 2)}</span>}
                  </div>
                  <div className="p-6">
                    {c.tag && <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{c.tag}</span>}
                    <h3 className="mt-3 text-xl font-semibold">{c.title}</h3>
                    {c.summary && <p className="mt-1.5 text-sm text-muted-foreground">{c.summary}</p>}
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
    </SiteLayout>
  );
}
