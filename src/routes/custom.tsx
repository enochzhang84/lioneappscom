import { createFileRoute, Link } from "@tanstack/react-router";
import { Wrench, Database, Layers, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHero } from "@/components/SiteLayout";

export const Route = createFileRoute("/custom")({
  head: () => ({
    meta: [
      { title: "定制管理系统 — Lione Apps" },
      { name: "description", content: "根据您的实际业务流程，量身定制专属的管理系统：CRM、库存、组织管理、业务自动化。" },
      { property: "og:title", content: "定制管理系统 — Lione Apps" },
      { property: "og:description", content: "完全按需开发的管理系统，从需求分析到上线维护。" },
    ],
  }),
  component: CustomPage,
});

const features = [
  { icon: Workflow, t: "业务流程定制", d: "根据您团队的真实流程设计系统逻辑。" },
  { icon: Database, t: "数据库架构设计", d: "可扩展、可维护的数据结构与关系建模。" },
  { icon: Layers, t: "多角色权限", d: "针对不同岗位设计细粒度权限控制。" },
  { icon: Wrench, t: "长期迭代维护", d: "系统上线后持续优化与功能扩展。" },
];

function CustomPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="定制管理系统"
        title="完全按需打造的管理平台"
        desc="从需求分析到数据库设计、系统开发与部署运维，提供一站式定制服务。"
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((f) => (
            <div key={f.t} className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <div className="rounded-3xl border border-border bg-card p-10 shadow-[var(--shadow-elegant)]">
          <h2 className="text-2xl md:text-3xl font-bold">聊聊您的业务</h2>
          <p className="mt-3 text-muted-foreground">告诉我们流程与痛点，我们提供方案与报价。</p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/contact">联系咨询</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
