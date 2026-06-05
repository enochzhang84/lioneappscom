import { createFileRoute, useNavigate, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { adminGetProduct, adminUpsertProduct } from "@/lib/cms-admin.functions";
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

export const Route = createFileRoute("/_authenticated/admin/products/$id")({
  component: ProductEditor,
});

type Feature = { title: string; desc: string };
type LongContent = { intro?: string; features?: Feature[]; cta?: string };

function ProductEditor() {
  const { id } = useParams({ from: "/_authenticated/admin/products/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const get = useServerFn(adminGetProduct);
  const upsert = useServerFn(adminUpsertProduct);

  const { data: product, isLoading } = useQuery({
    queryKey: ["admin", "product", id],
    queryFn: () => get({ data: { id } }),
    enabled: !isNew,
  });

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [hero, setHero] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [intro, setIntro] = useState("");
  const [features, setFeatures] = useState<Feature[]>([]);
  const [cta, setCta] = useState("");

  useEffect(() => {
    if (product) {
      setSlug(product.slug ?? "");
      setTitle(product.title ?? "");
      setTag(product.tag ?? "");
      setShortDesc(product.short_desc ?? "");
      setHero(product.hero_image_url ?? null);
      setSortOrder(product.sort_order ?? 0);
      setIsVisible(product.is_visible ?? true);
      const lc = (product.long_content ?? {}) as LongContent;
      setIntro(lc.intro ?? "");
      setFeatures(Array.isArray(lc.features) ? lc.features : []);
      setCta(lc.cta ?? "");
    }
  }, [product]);

  const m = useMutation({
    mutationFn: upsert,
    onSuccess: () => { toast.success("已保存"); navigate({ to: "/admin/products" }); },
    onError: (e: Error) => toast.error(e.message),
  });

  function save(e: React.FormEvent) {
    e.preventDefault();
    m.mutate({
      data: {
        id: isNew ? undefined : id,
        slug, title, tag: tag || null, short_desc: shortDesc || null,
        hero_image_url: hero, sort_order: sortOrder, is_visible: isVisible,
        long_content: { intro, features, cta },
      },
    });
  }

  if (!isNew && isLoading) return <div className="p-8 text-muted-foreground">加载中…</div>;
  if (!isNew && !product) return <div className="p-8 text-muted-foreground">未找到。</div>;

  return (
    <form onSubmit={save} className="p-8 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isNew ? "新建产品" : "编辑产品"}</h1>
        <Button asChild variant="ghost" type="button"><Link to="/admin/products">← 返回</Link></Button>
      </div>

      <Card>
        <CardHeader><CardTitle>基本信息</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="标题"><Input value={title} onChange={e => setTitle(e.target.value)} required /></Field>
            <Field label="Slug（URL 路径）"><Input value={slug} onChange={e => setSlug(e.target.value)} pattern="[a-z0-9-]+" required placeholder="church" /></Field>
            <Field label="标签"><Input value={tag} onChange={e => setTag(e.target.value)} placeholder="教会 / 非营利" /></Field>
            <Field label="排序值（小的在前）"><Input type="number" value={sortOrder} onChange={e => setSortOrder(parseInt(e.target.value) || 0)} /></Field>
          </div>
          <Field label="简短介绍（首页卡片显示）">
            <Textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} rows={2} />
          </Field>
          <ImageUpload value={hero} onChange={setHero} folder="products" label="封面图" />
          <div className="flex items-center gap-3">
            <Switch checked={isVisible} onCheckedChange={setIsVisible} id="vis" />
            <Label htmlFor="vis">在网站上显示</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>详情页内容</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="介绍段落"><Textarea value={intro} onChange={e => setIntro(e.target.value)} rows={3} /></Field>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>功能模块</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setFeatures([...features, { title: "", desc: "" }])}>
                <Plus size={14} className="mr-1" />添加
              </Button>
            </div>
            {features.length === 0 && <p className="text-sm text-muted-foreground">还没有功能模块。</p>}
            {features.map((f, i) => (
              <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start rounded-md border border-border p-3">
                <Input placeholder="标题" value={f.title} onChange={e => {
                  const n = [...features]; n[i] = { ...n[i], title: e.target.value }; setFeatures(n);
                }} />
                <Textarea placeholder="描述" rows={2} value={f.desc} onChange={e => {
                  const n = [...features]; n[i] = { ...n[i], desc: e.target.value }; setFeatures(n);
                }} />
                <Button type="button" size="icon" variant="ghost" onClick={() => setFeatures(features.filter((_, x) => x !== i))}>
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>

          <Field label="按钮文字（CTA）"><Input value={cta} onChange={e => setCta(e.target.value)} placeholder="预约演示" /></Field>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" disabled={m.isPending}>{m.isPending ? "保存中…" : "保存"}</Button>
        <Button asChild type="button" variant="ghost"><Link to="/admin/products">取消</Link></Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
