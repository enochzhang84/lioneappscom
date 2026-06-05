import { createFileRoute, Link } from "@tanstack/react-router";
import { Church, Calculator, Briefcase, Sparkles, ArrowRight, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lione Apps — 专属管理平台开发" },
      { name: "description", content: "Lione Apps 为教会、组织与小型企业打造专属管理平台与业务系统。" },
      { property: "og:title", content: "Lione Apps — 专属管理平台开发" },
      { property: "og:description", content: "为教会、组织与小型企业打造专属管理平台与业务系统。" },
    ],
  }),
  component: Home,
});

const products = [
  {
    to: "/church",
    icon: Church,
    title: "教会管理平台",
    desc: "新人登记、主日学、活动报名、TV 数字标牌等事工全流程管理。",
  },
  {
    to: "/renovation",
    icon: Calculator,
    title: "装修报价平台",
    desc: "项目分类、自动报价、客户报价单生成与 Excel 导出。",
  },
  {
    to: "/office",
    icon: Briefcase,
    title: "企业办公平台",
    desc: "考勤、排班、任务管理与数据统计，告别 Excel 与纸质记录。",
  },
  {
    to: "/custom",
    icon: Wrench,
    title: "定制管理系统",
    desc: "根据您的实际业务流程，量身定制专属管理系统。",
  },
] as const;

function Home() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{ background: "radial-gradient(60% 50% at 50% 0%, oklch(0.55 0.22 264 / 0.18), transparent 70%)" }}
        />
        <div className="mx-auto max-w-5xl px-6 pt-24 pb-16 md:pt-32 md:pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            专业管理平台开发工作室
          </div>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Lione Apps
          </h1>
          <p
            className="mt-4 text-2xl md:text-3xl font-semibold bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-hero)" }}
          >
            专属管理平台开发
          </p>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            从网站到后台管理平台，帮助组织实现数字化管理与业务自动化。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/cases">查看案例 <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">联系咨询</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">服务项目</h2>
          <p className="mt-3 text-muted-foreground">点击卡片了解每个平台的详细功能</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="group block rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)] hover:border-primary/30"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <p.icon className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    {p.title}
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-primary">
                    了解详情 →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
