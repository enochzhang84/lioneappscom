import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderKanban, Calculator, FileText, FileSpreadsheet, ClipboardList, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHero } from "@/components/SiteLayout";

export const Route = createFileRoute("/renovation")({
  head: () => ({
    meta: [
      { title: "装修报价平台 — Lione Apps" },
      { name: "description", content: "适用于装修公司与工程团队的报价与项目管理系统：项目分类、自动报价、客户报价单、Excel 导出与项目管理。" },
      { property: "og:title", content: "装修报价平台 — Lione Apps" },
      { property: "og:description", content: "项目报价与施工管理一体化系统。" },
    ],
  }),
  component: RenovationPage,
});

const features = [
  { icon: FolderKanban, t: "项目分类管理", d: "按房型、施工类型与材料分类管理。" },
  { icon: Calculator, t: "自动报价计算", d: "人工、材料、面积一键自动计算。" },
  { icon: FileText, t: "客户报价单", d: "一键生成专业格式的报价单。" },
  { icon: FileSpreadsheet, t: "Excel 导出", d: "支持导出 Excel 方便存档与对账。" },
  { icon: ClipboardList, t: "项目管理", d: "项目进度、客户、跟进记录一体化。" },
];

function RenovationPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="装修报价平台"
        title="专为装修团队设计的报价系统"
        desc="告别 Excel 与手算，让每一份报价都准确、专业、可追溯。"
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.t} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <div className="rounded-3xl border border-border bg-card p-10 shadow-[var(--shadow-elegant)]">
          <h2 className="text-2xl md:text-3xl font-bold">想先体验一下？</h2>
          <p className="mt-3 text-muted-foreground">我们提供免费试用，带你跑通一个真实报价流程。</p>
          <ul className="mt-6 grid gap-2 max-w-md mx-auto text-left">
            {["导入您的材料与人工单价", "试做一份完整报价单", "导出 Excel 看效果"].map((x) => (
              <li key={x} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 mt-0.5 text-primary" />{x}</li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-8">
            <Link to="/contact">申请试用</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
