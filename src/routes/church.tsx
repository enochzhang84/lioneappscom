import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, UserPlus, BookOpen, UtensilsCrossed, Tv, ShieldCheck, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHero } from "@/components/SiteLayout";

export const Route = createFileRoute("/church")({
  head: () => ({
    meta: [
      { title: "教会管理平台 — Lione Apps" },
      { name: "description", content: "适用于教会与非营利机构的一体化事工管理平台：新人登记、主日学、厨房、TV 数字标牌、权限与数据分析。" },
      { property: "og:title", content: "教会管理平台 — Lione Apps" },
      { property: "og:description", content: "覆盖教会事工全流程的一体化数字化管理系统。" },
    ],
  }),
  component: ChurchPage,
});

const modules = [
  { icon: UserPlus, t: "新人登记", d: "线上线下统一登记，自动建立跟进档案。" },
  { icon: BookOpen, t: "主日学管理", d: "班级、出勤、教材与家长沟通一体化。" },
  { icon: UtensilsCrossed, t: "厨房管理", d: "菜单、采购、人手排班与成本统计。" },
  { icon: Tv, t: "TV 数字标牌", d: "多屏内容统一发布与远程更新。" },
  { icon: ShieldCheck, t: "权限管理", d: "多角色细粒度权限，保护教会数据。" },
  { icon: BarChart3, t: "数据统计分析", d: "聚会、事工、人员增长一目了然。" },
];

function ChurchPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="教会管理平台"
        title="一体化教会事工管理系统"
        desc="为教会与非营利机构提供从新人登记到主日学、厨房、影音、TV 数字标牌的全流程数字化管理。"
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center">系统简介</h2>
        <p className="mt-4 text-muted-foreground max-w-3xl mx-auto text-center">
          基于真实教会运营场景设计，覆盖牧养、教导、服侍与行政全流程。所有数据集中管理，
          支持多堂点协同，让同工把更多时间放在事工本身。
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">功能模块</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {modules.map((m) => (
            <div key={m.t} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <m.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{m.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{m.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">系统截图</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {["新人跟进面板", "主日学考勤", "数字标牌后台"].map((label) => (
            <div key={label} className="rounded-2xl overflow-hidden border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="aspect-video w-full" style={{ background: "var(--gradient-hero)" }} />
              <div className="p-4 text-sm text-muted-foreground text-center">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <div className="rounded-3xl border border-border bg-card p-10 shadow-[var(--shadow-elegant)]">
          <h2 className="text-2xl md:text-3xl font-bold">想看一次完整演示？</h2>
          <p className="mt-3 text-muted-foreground">我们提供一对一在线演示，按您的事工流程逐步讲解。</p>
          <ul className="mt-6 grid gap-2 max-w-md mx-auto text-left">
            {["按事工模块逐一演示", "回答您的实际问题", "提供报价与落地建议"].map((x) => (
              <li key={x} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 mt-0.5 text-primary" />{x}</li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-8">
            <Link to="/contact">预约演示</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
