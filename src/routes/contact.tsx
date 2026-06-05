import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent } from "react";
import { Mail, MessageCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SiteLayout, PageHero } from "@/components/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "联系我们 — Lione Apps" },
      { name: "description", content: "通过表单、邮箱或在线咨询联系 Lione Apps,获取定制管理平台方案。" },
      { property: "og:title", content: "联系我们 — Lione Apps" },
      { property: "og:description", content: "聊聊您的项目需求。" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const contact = String(fd.get("contact") || "").trim();
    if (!name || !contact) {
      toast.error("请填写姓名与联系方式");
      return;
    }
    toast.success("感谢咨询!我们会尽快与您联系。");
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <SiteLayout>
      <PageHero eyebrow="联系我们" title="聊聊您的项目" desc="欢迎咨询管理平台、办公系统、报名登记、报价系统与定制业务系统。" />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold">联系方式</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">邮箱</div>
                  <a href="mailto:hello@lioneapps.com" className="text-sm text-muted-foreground hover:text-foreground">
                    hello@lioneapps.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">网站</div>
                  <a href="https://lioneapps.com" className="text-sm text-muted-foreground hover:text-foreground">
                    lioneapps.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">在线咨询</div>
                  <div className="text-sm text-muted-foreground">通过右侧表单提交需求,我们会尽快回复。</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
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
              <Textarea id="message" name="message" maxLength={1000} rows={5} placeholder="简单描述您的业务与希望解决的问题" />
            </div>
            <Button type="submit" className="w-full" size="lg">提交咨询</Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
