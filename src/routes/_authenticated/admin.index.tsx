import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminListProducts, adminListCases, adminListSettings } from "@/lib/cms-admin.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const lp = useServerFn(adminListProducts);
  const lc = useServerFn(adminListCases);
  const ls = useServerFn(adminListSettings);
  const products = useQuery({ queryKey: ["admin", "products"], queryFn: () => lp() });
  const cases = useQuery({ queryKey: ["admin", "cases"], queryFn: () => lc() });
  const settings = useQuery({ queryKey: ["admin", "settings"], queryFn: () => ls() });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">概览</h1>
        <p className="text-sm text-muted-foreground mt-1">欢迎回来。这里是网站内容的快速入口。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="产品数量" value={products.data?.length ?? "—"} to="/admin/products" />
        <StatCard title="案例数量" value={cases.data?.length ?? "—"} to="/admin/cases" />
        <StatCard title="站点设置" value={settings.data?.length ?? "—"} to="/admin/settings" />
      </div>
      <Card>
        <CardHeader><CardTitle>快速操作</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild><Link to="/admin/products/new">+ 新建产品</Link></Button>
          <Button asChild variant="outline"><Link to="/admin/cases/new">+ 新建案例</Link></Button>
          <Button asChild variant="outline"><Link to="/admin/settings">编辑首页文案</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, to }: { title: string; value: number | string; to: string }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground font-normal">{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold">{value}</div>
          <Button asChild variant="ghost" size="sm"><Link to={to}>管理 →</Link></Button>
        </div>
      </CardContent>
    </Card>
  );
}
