import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Database, Palette, Code2, TestTube, GraduationCap } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "开发流程 — Lione Apps" },
      { name: "description", content: "Lione Apps 的六步开发流程:需求分析、数据库设计、UI 设计、系统开发、测试部署、培训交付。" },
      { property: "og:title", content: "开发流程 — Lione Apps" },
      { property: "og:description", content: "清晰透明的六步交付流程。" },
    ],
  }),
  component: ProcessPage,
});

const steps = [
  { icon: MessageSquare, t: "需求分析", d: "深入了解您的业务流程、痛点与目标,梳理功能优先级。" },
  { icon: Database, t: "数据库设计", d: "设计可扩展的数据结构,为系统打下坚实基础。" },
  { icon: Palette, t: "UI 设计", d: "现代、简洁、专业的界面设计,兼顾美观与易用性。" },
  { icon: Code2, t: "系统开发", d: "敏捷开发、阶段性演示,确保方向准确。" },
  { icon: TestTube, t: "测试部署", d: "全面测试后部署上线,可选择 VPS 部署。" },
  { icon: GraduationCap, t: "培训交付", d: "提供操作培训与文档,保证团队顺利上手。" },
];

function ProcessPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="开发流程" title="清晰透明的六步交付" desc="从想法到上线,每一步都有迹可循。" />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.t} className="relative rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="absolute right-5 top-5 text-3xl font-bold text-primary/10">0{i + 1}</div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
