import { Link } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

const navLinks = [
  { to: "/", label: "首页" },
  { to: "/church", label: "教会管理平台" },
  { to: "/renovation", label: "装修报价平台" },
  { to: "/office", label: "企业办公平台" },
  { to: "/cases", label: "案例" },
  { to: "/process", label: "开发流程" },
  { to: "/about", label: "关于我们" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster richColors position="top-center" />
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              L
            </div>
            <span>Lione Apps</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            {navLinks.slice(1).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="hover:text-foreground transition"
                activeProps={{ className: "text-foreground font-medium" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Button asChild size="sm">
            <Link to="/contact">联系咨询</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border mt-20">
        <div className="mx-auto max-w-6xl px-6 py-10 grid gap-8 md:grid-cols-3 text-sm">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs">
                L
              </div>
              <span>Lione Apps</span>
            </div>
            <p className="mt-3 text-muted-foreground">
              专注于为教会、组织与小型企业打造专属管理平台与业务系统。
            </p>
          </div>
          <div>
            <div className="font-semibold mb-3">产品</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/church" className="hover:text-foreground">教会管理平台</Link></li>
              <li><Link to="/renovation" className="hover:text-foreground">装修报价平台</Link></li>
              <li><Link to="/office" className="hover:text-foreground">企业办公平台</Link></li>
              <li><Link to="/custom" className="hover:text-foreground">定制管理系统</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">公司</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/cases" className="hover:text-foreground">项目案例</Link></li>
              <li><Link to="/process" className="hover:text-foreground">开发流程</Link></li>
              <li><Link to="/about" className="hover:text-foreground">关于我们</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">联系我们</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Lione Apps. All rights reserved.</span>
            <span>lioneapps.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{ background: "radial-gradient(60% 50% at 50% 0%, oklch(0.55 0.22 264 / 0.18), transparent 70%)" }}
      />
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24 text-center">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
        {desc && <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">{desc}</p>}
      </div>
    </section>
  );
}
