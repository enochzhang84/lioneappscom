import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, CalendarDays, ListChecks, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHero } from "@/components/SiteLayout";

export const Route = createFileRoute("/office")({
  head: () => ({
    meta: [
      { title: "企业办公平台 — Lione Apps" },
      { name: "description", content: "适用于小型企业的办公管理系统：考勤、排班、任务管理与数据统计。" },
      { property: "og:title", content: "企业办公平台 — Lione Apps" },
      { property: "og:description", content: "让小型企业告别 Excel 与纸质记录，建立属于自己的办公平台。" },
    ],
  }),
  component: OfficePage,
});

const features = [
  { icon: Clock, t: "考勤管理", d: "上下班打卡、请假审批、考勤报表自动生成。" },
  { icon: CalendarDays, t: "排班管理", d: "灵活排班、轮班、班次冲突自动提醒。" },
  { icon: ListChecks, t: "任务管理", d: "任务派发、进度跟踪、团队协作。" },
  { icon: BarChart3, t: "数据统计", d: "员工、项目、业务数据可视化报表。" },
];

function OfficePage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="企业办公平台"
        title="为小型企业打造的内部管理系统"
        desc="集成考勤、排班、任务与数据统计，让团队协作和管理效率全面提升。"
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
          <h2 className="text-2xl md:text-3xl font-bold">为团队搭建专属办公平台</h2>
          <p className="mt-3 text-muted-foreground">我们根据您的实际流程定制开发，让系统真正贴合业务。</p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/contact">联系咨询</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
