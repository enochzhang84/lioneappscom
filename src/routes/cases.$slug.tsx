import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHero } from "@/components/SiteLayout";

type CaseData = {
  slug: string;
  tag: string;
  title: string;
  summary: string;
  client: string;
  year: string;
  features: string[];
  outcomes: string[];
};

const CASES: Record<string, CaseData> = {
  hoc3: {
    slug: "hoc3",
    tag: "教会管理",
    title: "HOC3 教会管理平台",
    summary: "为教会量身打造的一体化事工管理平台，覆盖牧养、教导、行政与服侍。",
    client: "HOC3 教会",
    year: "2023 - 至今",
    features: [
      "新人登记与跟进流程",
      "主日学班级与考勤管理",
      "活动报名与签到",
      "厨房 / 影音 / 服侍排班",
      "TV 数字标牌系统",
      "多角色权限与数据统计",
    ],
    outcomes: [
      "新人跟进效率显著提升",
      "事工同工节省大量行政时间",
      "所有数据集中、可追溯",
    ],
  },
  "renovation-quote": {
    slug: "renovation-quote",
    tag: "工程报价",
    title: "装修报价管理系统",
    summary: "为装修团队打造的报价与项目管理系统，告别手算 Excel。",
    client: "本地装修团队",
    year: "2024",
    features: [
      "项目分类与材料单价管理",
      "自动报价计算引擎",
      "专业报价单生成",
      "Excel 一键导出",
      "客户与项目跟踪",
    ],
    outcomes: [
      "单份报价从数小时缩短到几分钟",
      "报价格式统一,客户更专业",
      "客户与项目数据集中管理",
    ],
  },
};

export const Route = createFileRoute("/cases/$slug")({
  loader: ({ params }) => {
    const c = CASES[params.slug];
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Lione Apps 案例` },
          { name: "description", content: loaderData.summary },
          { property: "og:title", content: `${loaderData.title} — Lione Apps 案例` },
          { property: "og:description", content: loaderData.summary },
        ]
      : [{ title: "案例 — Lione Apps" }],
  }),
  component: CaseDetail,
});

function CaseDetail() {
  const c = Route.useLoaderData();
  return (
    <SiteLayout>
      <PageHero eyebrow={c.tag} title={c.title} desc={c.summary} />

      <section className="mx-auto max-w-4xl px-6 py-16">
        <Link to="/cases" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> 返回案例列表
        </Link>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">客户</div>
            <div className="mt-1 font-semibold">{c.client}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs text-muted-foreground">项目周期</div>
            <div className="mt-1 font-semibold">{c.year}</div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold">核心功能</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {c.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 mt-0.5 text-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold">项目成果</h2>
          <ul className="mt-4 grid gap-2">
            {c.outcomes.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 mt-0.5 text-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
          <h3 className="text-xl font-bold">想了解类似方案？</h3>
          <p className="mt-2 text-sm text-muted-foreground">我们可以根据您的业务需求,提供量身定制的报价。</p>
          <Button asChild className="mt-5">
            <Link to="/contact">联系咨询</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
