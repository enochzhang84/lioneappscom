import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Code2, Server, Database, LifeBuoy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { getSettings } from "@/lib/cms.functions";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "关于我们 — Lione Apps" },
      { name: "description", content: "Lione Apps 致力于为教会、组织与小型企业打造可长期使用的专属管理平台。" },
    ],
  }),
  loader: async () => ({ settings: await getSettings() }),
  component: AboutPage,
});

const fallbackCapabilities = [
  { icon: Code2, t: "定制开发能力", d: "覆盖前端、后端、数据库与系统集成的全栈开发能力。" },
  { icon: Server, t: "VPS 部署能力", d: "独立服务器部署、域名 SSL 配置与日常运维。" },
  { icon: Database, t: "数据库设计能力", d: "可扩展的数据结构设计,支持后期业务变化。" },
  { icon: LifeBuoy, t: "后期维护服务", d: "上线后持续优化、功能扩展与故障响应。" },
];

function AboutPage() {
  const { settings } = Route.useLoaderData();
  const about = (settings.about ?? {}) as { mission?: string; capabilities?: string[] };
  const mission = about.mission || "帮助组织将日常业务流程数字化,建立属于自己的管理平台,把精力放在真正重要的事工和业务上,而不是繁琐的行政记录。";
  const capList = about.capabilities && about.capabilities.length > 0 ? about.capabilities : null;

  return (
    <SiteLayout>
      <PageHero eyebrow="关于我们" title="Lione Apps" desc="为教会、组织与小型企业打造可长期使用的管理平台。" />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">我们的使命</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{mission}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">我们的能力</h2>
        {capList ? (
          <div className="grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
            {capList.map((c) => (
              <div key={c} className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
                <CheckCircle2 className="text-primary mt-0.5" size={20} />
                <span className="font-medium">{c}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {fallbackCapabilities.map((c) => (
              <div key={c.t} className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{c.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <div className="rounded-3xl border border-border bg-card p-10 shadow-[var(--shadow-elegant)]">
          <h2 className="text-2xl md:text-3xl font-bold">让我们一起开始</h2>
          <p className="mt-3 text-muted-foreground">无论项目大小,我们都欢迎一次深入的沟通。</p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/contact">联系我们</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
