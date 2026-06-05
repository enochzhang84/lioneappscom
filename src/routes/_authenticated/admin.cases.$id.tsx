import { createFileRoute, useNavigate, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { adminGetCase, adminUpsertCase } from "@/lib/cms-admin.functions";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/cases/$id")({
  component: CaseEditor,
});

type Details = { client?: string; highlights?: string[]; features?: string[] };

function CaseEditor() {
  const { id } = useParams({ from: "/_authenticated/admin/cases/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const get = useServerFn(adminGetCase);
  const upsert = useServerFn(adminUpsertCase);

  const { data: row, isLoading } = useQuery({
    queryKey: ["admin", "case", id],
    queryFn: () => get({ data: { id } }),
    enabled: !isNew,
  });

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [summary, setSummary] = useState("");
  const [cover, setCover] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [client, setClient] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  useEffect(() => {
    if (row) {
      setSlug(row.slug ?? ""); setTitle(row.title ?? "");
      setTag(row.tag ?? ""); setSummary(row.summary ?? "");
      setCover(row.cover_image_url ?? null);
      setSortOrder(row.sort_order ?? 0); setIsVisible(row.is_visible ?? true);
      const d = (row.details ?? {}) as Details;
      setClient(d.client ?? "");
      setHighlights(Array.isArray(d.highlights) ? d.highlights : []);
      setFeatures(Array.isArray(d.features) ? d.features : []);
    }
  }, [row]);

  const m = useMutation({
    mutationFn: upsert,
    onSuccess: () => { toast.success("已保存"); navigate({ to: "/admin/cases" }); },
    onError: (e: Error) => toast.error(e.message),
  });

  function save(e: React.FormEvent) {
    e.preventDefault();
    m.mutate({ data: {
      id: isNew ? undefined : id,
      slug, title, tag: tag || null, cover_image_url: cover,
      summary: summary || null, sort_order: sortOrder, is_visible: isVisible,
      details: { client, highlights, features },
    } });
  }

  if (!isNew && isLoading) return <div className="p-8 text-muted-foreground">加载中…</div>;
  if (!isNew && !row) return <div className="p-8 text-muted-foreground">未找到。</div>;

  return (
    <form onSubmit={save} className="p-8 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isNew ? "新建案例" : "编辑案例"}</h1>
        <Button asChild variant="ghost" type="button"><Link to="/admin/cases">← 返回</Link></Button>
      </div>
      <Card>
        <CardHeader><CardTitle>基本信息</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="标题"><Input value={title} onChange={e => setTitle(e.target.value)} required /></Field>
            <Field label="Slug"><Input value={slug} onChange={e => setSlug(e.target.value)} pattern="[a-z0-9-]+" required /></Field>
            <Field label="标签"><Input value={tag} onChange={e => setTag(e.target.value)} /></Field>
            <Field label="排序值"><Input type="number" value={sortOrder} onChange={e => setSortOrder(parseInt(e.target.value) || 0)} /></Field>
          </div>
          <Field label="一句话概述"><Textarea value={summary} onChange={e => setSummary(e.target.value)} rows={2} /></Field>
          <ImageUpload value={cover} onChange={setCover} folder="cases" label="封面图" />
          <div className="flex items-center gap-3">
            <Switch checked={isVisible} onCheckedChange={setIsVisible} id="vis" />
            <Label htmlFor="vis">在网站上显示</Label>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>详情</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="客户"><Input value={client} onChange={e => setClient(e.target.value)} /></Field>
          <StringList label="项目亮点" items={highlights} onChange={setHighlights} placeholder="亮点描述" />
          <StringList label="包含功能" items={features} onChange={setFeatures} placeholder="功能名称" />
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Button type="submit" disabled={m.isPending}>{m.isPending ? "保存中…" : "保存"}</Button>
        <Button asChild type="button" variant="ghost"><Link to="/admin/cases">取消</Link></Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

function StringList({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" size="sm" variant="outline" onClick={() => onChange([...items, ""])}>
          <Plus size={14} className="mr-1" />添加
        </Button>
      </div>
      {items.length === 0 && <p className="text-sm text-muted-foreground">空</p>}
      {items.map((s, i) => (
        <div key={i} className="flex gap-2">
          <Input value={s} placeholder={placeholder} onChange={e => {
            const n = [...items]; n[i] = e.target.value; onChange(n);
          }} />
          <Button type="button" size="icon" variant="ghost" onClick={() => onChange(items.filter((_, x) => x !== i))}>
            <Trash2 size={14} />
          </Button>
        </div>
      ))}
    </div>
  );
}
