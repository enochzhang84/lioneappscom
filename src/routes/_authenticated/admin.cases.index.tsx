import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminListCases, adminToggleCaseVisibility, adminDeleteCase, adminMoveCase,
} from "@/lib/cms-admin.functions";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/cases/")({
  component: CasesList,
});

function CasesList() {
  const qc = useQueryClient();
  const list = useServerFn(adminListCases);
  const toggle = useServerFn(adminToggleCaseVisibility);
  const del = useServerFn(adminDeleteCase);
  const move = useServerFn(adminMoveCase);
  const { data, isLoading } = useQuery({ queryKey: ["admin", "cases"], queryFn: () => list() });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "cases"] });
  const mToggle = useMutation({ mutationFn: toggle, onSuccess: refresh });
  const mDelete = useMutation({ mutationFn: del, onSuccess: () => { toast.success("已删除"); refresh(); }, onError: (e: Error) => toast.error(e.message) });
  const mMove = useMutation({ mutationFn: move, onSuccess: refresh });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">案例</h1></div>
        <Button asChild><Link to="/admin/cases/$id" params={{ id: "new" }}>+ 新建案例</Link></Button>
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">排序</TableHead>
              <TableHead>标题</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-28">可见</TableHead>
              <TableHead className="w-40 text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">加载中…</TableCell></TableRow>}
            {!isLoading && (data?.length ?? 0) === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">还没有案例</TableCell></TableRow>}
            {data?.map((c, i) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground w-6">{c.sort_order}</span>
                    <Button size="icon" variant="ghost" className="h-7 w-7" disabled={i === 0}
                      onClick={() => mMove.mutate({ data: { id: c.id, sort_order: (data[i-1].sort_order ?? 0) - 1 } })}>
                      <ArrowUp size={14} />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" disabled={i === data.length - 1}
                      onClick={() => mMove.mutate({ data: { id: c.id, sort_order: (data[i+1].sort_order ?? 0) + 1 } })}>
                      <ArrowDown size={14} />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                <TableCell>
                  <Switch checked={c.is_visible}
                    onCheckedChange={(v) => mToggle.mutate({ data: { id: c.id, is_visible: v } })} />
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button asChild size="sm" variant="outline">
                    <Link to="/admin/cases/$id" params={{ id: c.id }}><Pencil size={14} className="mr-1" />编辑</Link>
                  </Button>
                  <Button size="sm" variant="ghost"
                    onClick={() => { if (confirm(`删除案例 "${c.title}"？`)) mDelete.mutate({ data: { id: c.id } }); }}>
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
