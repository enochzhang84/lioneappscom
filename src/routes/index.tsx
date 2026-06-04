import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Church,
  Building2,
  Calculator,
  Briefcase,
  Users,
  ShieldCheck,
  BarChart3,
  Zap,
  Workflow,
  MessageSquare,
  ArrowRight,
  Check,
  Sparkles,
  Code2,
  Rocket,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lione Apps — 管理平台与业务系统开发" },
      { name: "description", content: "Lione Apps 专注于为教会、组织与小型企业开发管理平台、办公系统与业务自动化解决方案。" },
      { property: "og:title", content: "Lione Apps — 管理平台与业务系统开发" },
      { property: "og:description", content: "从网站到后台管理平台，帮助组织实现数字化管理与业务自动化。" },
    ],
  }),
  component: Index,
});

function useCountUp(target: number, start: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return value;
}

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const n = useCountUp(value, visible);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-primary tabular-nums">
        {n}
        {suffix}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-6 py-20 md:py-28 ${className}`}>
      {children}
    </section>
  );
}

function SectionHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center mb-14">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary">
        <Sparkles className="h-3 w-3" />
        {eyebrow}
      </div>
      <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
      {desc && <p className="mt-3 text-muted-foreground">{desc}</p>}
    </div>
  );
}

function ServiceCard({
  icon: Icon,
  title,
  desc,
  items,
  highlighted,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  items: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`group relative rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
        highlighted
          ? "border-primary/30 bg-card shadow-[var(--shadow-elegant)]"
          : "border-border bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)]"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          重点推广
        </div>
      )}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      <ul className="mt-5 space-y-2">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm text-foreground/80">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Index() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const contact = String(fd.get("contact") || "").trim();
    if (!name || !contact) {
      toast.error("请填写姓名与联系方式");
      return;
    }
    toast.success("感谢咨询！我们会尽快与您联系。");
    (e.currentTarget as HTMLFormElement).reset();
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-center" />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <button onClick={() => scrollTo("top")} className="flex items-center gap-2 font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              L
            </div>
            <span>Lione Apps</span>
          </button>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <button onClick={() => scrollTo("services")} className="hover:text-foreground transition">服务项目</button>
            <button onClick={() => scrollTo("cases")} className="hover:text-foreground transition">案例展示</button>
            <button onClick={() => scrollTo("why")} className="hover:text-foreground transition">为什么选择</button>
            <button onClick={() => scrollTo("process")} className="hover:text-foreground transition">开发流程</button>
            <button onClick={() => scrollTo("pricing")} className="hover:text-foreground transition">价格方案</button>
          </nav>
          <Button onClick={() => scrollTo("contact")} size="sm">联系咨询</Button>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-60"
             style={{ background: "radial-gradient(60% 50% at 50% 0%, oklch(0.55 0.22 264 / 0.18), transparent 70%)" }} />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              专业管理平台开发工作室
            </div>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              为教会、组织与小型企业
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
                打造专属管理平台与业务系统
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              从网站到后台管理平台，帮助组织实现数字化管理与业务自动化。
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={() => scrollTo("cases")}>
                查看案例 <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollTo("contact")}>
                联系咨询
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-8 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)] md:grid-cols-4">
            <Stat value={20} suffix="+" label="交付项目" />
            <Stat value={15} suffix="+" label="服务客户" />
            <Stat value={98} suffix="%" label="客户满意度" />
            <Stat value={5} suffix="年" label="开发经验" />
          </div>
        </div>
      </section>

      {/* Services */}
      <Section id="services">
        <SectionHeader
          eyebrow="服务项目"
          title="一站式管理平台开发"
          desc="不是简单的网站，而是真正解决业务流程的数字化系统。"
        />
        <div className="grid gap-6 md:grid-cols-2">
          <ServiceCard
            icon={Briefcase}
            title="办公平台"
            desc="帮助小型企业建立自己的内部管理系统，告别 Excel 与纸质记录。"
            highlighted
            items={[
              "客户管理（CRM）",
              "员工管理",
              "项目管理",
              "库存管理",
              "业务流程管理",
              "数据统计报表",
              "权限控制系统",
            ]}
          />
          <ServiceCard
            icon={Church}
            title="教会管理平台"
            desc="适用于教会与非营利机构的一体化事工管理系统。"
            items={[
              "新人登记与跟进",
              "主日学管理",
              "活动报名系统",
              "厨房事工 / 影音事工",
              "TV 数字标牌系统",
              "数据统计分析",
              "权限管理",
            ]}
          />
          <ServiceCard
            icon={Calculator}
            title="装修报价平台"
            desc="适用于装修公司与工程团队的报价与项目管理系统。"
            items={[
              "项目报价管理",
              "人工与材料计算",
              "客户管理",
              "报价单生成",
              "项目跟踪",
              "数据统计分析",
            ]}
          />
          <ServiceCard
            icon={Building2}
            title="小型商业网站"
            desc="适用于公司、商家与个人品牌的现代化官网。"
            items={[
              "企业官网",
              "服务与产品展示",
              "在线预约",
              "联系表单",
              "品牌宣传页面",
              "响应式设计",
            ]}
          />
        </div>
      </Section>

      {/* Cases */}
      <Section id="cases" className="!py-20">
        <SectionHeader eyebrow="案例展示" title="真实交付项目" desc="已上线运行的管理平台与业务系统。" />
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              tag: "教会管理",
              title: "HOC3 教会管理平台",
              desc: "覆盖事工全流程的一体化管理系统。",
              items: [
                "新人登记",
                "主日学管理",
                "活动报名",
                "厨房 / 影音事工",
                "数字标牌系统",
                "统计分析与权限管理",
              ],
            },
            {
              tag: "工程报价",
              title: "装修报价管理系统",
              desc: "项目分类、报价、客户管理全打通。",
              items: ["项目分类", "报价计算", "客户管理", "报价单生成", "项目统计"],
            },
          ].map((c) => (
            <div
              key={c.title}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-elegant)]"
            >
              <div
                className="h-44 w-full"
                style={{ background: "var(--gradient-hero)" }}
              >
                <div className="flex h-full items-end p-6">
                  <span className="rounded-full bg-background/95 px-3 py-1 text-xs font-medium text-primary">
                    {c.tag}
                  </span>
                </div>
              </div>
              <div className="p-7">
                <h3 className="text-xl font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {c.items.map((it) => (
                    <span key={it} className="rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Why */}
      <Section id="why">
        <SectionHeader
          eyebrow="为什么选择 Lione Apps"
          title="不只是开发，更是业务伙伴"
          desc="我们专注于真实业务场景，为客户打造可长期使用的管理平台。"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Workflow, t: "业务流程驱动", d: "从理解你的业务流程开始，而不是从模板开始。" },
            { icon: Zap, t: "高效交付", d: "敏捷开发、快速迭代，让系统尽快上线服务你的团队。" },
            { icon: ShieldCheck, t: "权限与数据安全", d: "完善的权限控制与数据管理，保护组织核心资产。" },
            { icon: BarChart3, t: "数据可视化", d: "内置统计与报表，业务指标一目了然。" },
            { icon: Users, t: "贴身服务", d: "一对一沟通，深入理解需求，长期维护与支持。" },
            { icon: LifeBuoy, t: "持续支持", d: "上线后持续优化与功能扩展，跟随业务一起成长。" },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section id="process">
        <SectionHeader eyebrow="开发流程" title="清晰透明的四步交付" />
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { icon: MessageSquare, t: "需求沟通", d: "深入了解业务流程与目标。" },
            { icon: Sparkles, t: "方案设计", d: "确定功能架构与系统原型。" },
            { icon: Code2, t: "开发实施", d: "敏捷开发，阶段性演示。" },
            { icon: Rocket, t: "上线维护", d: "部署上线，持续支持优化。" },
          ].map((s, i) => (
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
      </Section>

      {/* Pricing */}
      <Section id="pricing">
        <SectionHeader eyebrow="价格方案" title="透明灵活的价格" desc="最终价格根据功能复杂度评估。" />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "基础网站",
              price: "$300",
              suffix: "起",
              desc: "个人 / 团契 / 小型企业官网",
              features: ["响应式设计", "品牌展示", "联系表单", "基础 SEO"],
            },
            {
              name: "管理平台",
              price: "$800",
              suffix: "起",
              desc: "报名 / 登记 / 统计 / 后台系统",
              features: ["用户与权限管理", "数据录入与查询", "统计报表", "后台仪表盘"],
              highlight: true,
            },
            {
              name: "定制系统",
              price: "$1500",
              suffix: "起",
              desc: "办公平台 / CRM / 库存 / 组织管理",
              features: ["完全定制开发", "多角色权限", "业务流程自动化", "持续迭代支持"],
            },
          ].map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border p-7 ${
                p.highlight
                  ? "border-primary bg-card shadow-[var(--shadow-elegant)]"
                  : "border-border bg-card shadow-[var(--shadow-card)]"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  最受欢迎
                </div>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="text-muted-foreground">{p.suffix}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-5 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-7 w-full"
                variant={p.highlight ? "default" : "outline"}
                onClick={() => scrollTo("contact")}
              >
                咨询此方案
              </Button>
            </div>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-elegant)]">
          <div className="grid md:grid-cols-2">
            <div className="p-10 md:p-12" style={{ background: "var(--gradient-hero)" }}>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                聊聊你的项目
              </h2>
              <p className="mt-3 text-primary-foreground/85">
                欢迎咨询：教会管理平台、企业办公平台、报名登记系统、装修报价系统、定制业务系统。
              </p>
              <div className="mt-8 space-y-3 text-primary-foreground/90 text-sm">
                <p>🌐 lioneapps.com</p>
                <p>✉️ 通过下方表单提交需求，我们会尽快回复。</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-10 md:p-12">
              <div className="space-y-2">
                <Label htmlFor="name">姓名 *</Label>
                <Input id="name" name="name" maxLength={80} required placeholder="您的姓名" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">联系方式 *</Label>
                <Input id="contact" name="contact" maxLength={120} required placeholder="邮箱 / 微信 / 电话" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org">组织 / 公司</Label>
                <Input id="org" name="org" maxLength={120} placeholder="可选" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">项目需求</Label>
                <Textarea id="message" name="message" maxLength={1000} rows={4} placeholder="简单描述您的业务与希望解决的问题" />
              </div>
              <Button type="submit" className="w-full" size="lg">
                提交咨询
              </Button>
            </form>
          </div>
        </div>
      </Section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
              L
            </div>
            <span>© {new Date().getFullYear()} Lione Apps. All rights reserved.</span>
          </div>
          <span>lioneapps.com</span>
        </div>
      </footer>
    </div>
  );
}
