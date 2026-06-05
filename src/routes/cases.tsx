import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";

export const Route = createFileRoute("/cases")({
  head: () => ({
    meta: [
      { title: "项目案例 — Lione Apps" },
      { name: "description", content: "Lione Apps 已交付的真实管理平台与业务系统案例展示。" },
      { property: "og:title", content: "项目案例 — Lione Apps" },
      { property: "og:description", content: "已上线运行的管理平台与业务系统。" },
    ],
  }),
  component: CasesPage,
});

const cases = [
  {
    slug: "hoc3",
    tag: "教会管理",
    title: "HOC3 教会管理平台",
    desc: "覆盖事工全流程的一体化管理系统，已稳定服务多年。",
    items: ["新人登记", "主日学", "活动报名", "厨房 / 影音", "数字标牌", "统计与权限"],
  },
  {
    slug: "renovation-quote",
    tag: "工程报价",
    title: "装修报价管理系统",
    desc: "项目分类、报价、客户管理与 Excel 导出全打通。",
    items: ["项目分类", "报价计算", "客户管理", "报价单生成", "项目统计"],
  },
];

function CasesPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="项目案例" title="真实交付的管理平台" desc="每个项目都来自真实客户的实际业务需求。" />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {cases.map((c) => (
            <Link
              key={c.slug}
              to="/cases/$slug"
              params={{ slug: c.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="h-44 w-full" style={{ background: "var(--gradient-hero)" }}>
                <div className="flex h-full items-end p-6">
                  <span className="rounded-full bg-background/95 px-3 py-1 text-xs font-medium text-primary">
                    {c.tag}
                  </span>
                </div>
              </div>
              <div className="p-7">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  {c.title}
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {c.items.map((it) => (
                    <span key={it} className="rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
