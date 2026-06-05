import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import churchImg from "@/assets/product-church.jpg";
import renovationImg from "@/assets/product-renovation.jpg";
import officeImg from "@/assets/product-office.jpg";
import customImg from "@/assets/product-custom.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lione Apps — 专属管理平台开发" },
      { name: "description", content: "为教会、组织与小型企业打造专属管理平台与业务系统。" },
      { property: "og:title", content: "Lione Apps — 专属管理平台开发" },
      { property: "og:description", content: "为教会、组织与小型企业打造专属管理平台与业务系统。" },
    ],
  }),
  component: Home,
});

const products = [
  { to: "/church", title: "教会管理平台", tag: "HOC3", desc: "事工全流程一体化管理。", img: churchImg },
  { to: "/renovation", title: "装修报价平台", tag: "Quote", desc: "项目报价与客户管理打通。", img: renovationImg },
  { to: "/office", title: "企业办公平台", tag: "Office", desc: "考勤、排班、任务与统计。", img: officeImg },
  { to: "/custom", title: "定制管理系统", tag: "Custom", desc: "按需打造的专属系统。", img: customImg },
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
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-12 md:pt-24 md:pb-14 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Lione Apps</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            为教会、组织与小型企业打造专属管理平台
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <a href="#products">查看产品 <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">联系咨询</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)] hover:border-primary/30"
            >
              <div className="aspect-[16/10] overflow-hidden bg-secondary">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="self-start rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {p.tag}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  查看详情 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact strip */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-[var(--shadow-card)] text-center">
          <h2 className="text-2xl md:text-3xl font-bold">想了解更多？</h2>
          <p className="mt-2 text-muted-foreground">告诉我们您的需求，我们会尽快回复。</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/contact"><MessageCircle className="mr-1 h-4 w-4" />在线表单</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="mailto:hello@lioneapps.com"><Mail className="mr-1 h-4 w-4" />hello@lioneapps.com</a>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
