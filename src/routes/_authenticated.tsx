import { createFileRoute, Outlet, Link, redirect, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { LayoutDashboard, Package, Briefcase, Settings, LogOut, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <div className="min-h-screen bg-muted/30 flex">
      <Toaster richColors position="top-center" />
      <aside className="w-60 shrink-0 border-r border-border bg-background flex flex-col">
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">L</div>
            <span>Lione 后台</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavItem to="/admin" icon={<LayoutDashboard size={16} />} label="概览" exact />
          <NavItem to="/admin/products" icon={<Package size={16} />} label="产品" />
          <NavItem to="/admin/cases" icon={<Briefcase size={16} />} label="案例" />
          <NavItem to="/admin/settings" icon={<Settings size={16} />} label="站点设置" />
        </nav>
        <div className="p-3 border-t border-border space-y-2">
          <Button asChild variant="outline" size="sm" className="w-full justify-start">
            <Link to="/"><ExternalLink size={14} className="mr-2" />查看网站</Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
            <LogOut size={14} className="mr-2" />退出登录
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, exact }: { to: string; icon: React.ReactNode; label: string; exact?: boolean }) {
  return (
    <Link
      to={to}
      activeOptions={exact ? { exact: true } : undefined}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
      activeProps={{ className: "flex items-center gap-2 rounded-md px-3 py-2 text-sm bg-accent text-foreground font-medium" }}
    >
      {icon}{label}
    </Link>
  );
}
