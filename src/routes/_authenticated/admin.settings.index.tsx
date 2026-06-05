import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminListSettings, adminUpsertSetting } from "@/lib/cms-admin.functions";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/settings/")({
  component: SettingsPage,
});

type Hero = { title?: string; subtitle?: string; cta_primary?: string; cta_secondary?: string };
type Contact = { email?: string; intro?: string };
type About = { mission?: string; capabilities?: string[] };

function SettingsPage() {
  const qc = useQueryClient();
  const list = useServerFn(adminListSettings);
  const upsert = useServerFn(adminUpsertSetting);
  const { data } = useQuery({ queryKey: ["admin", "settings"], queryFn: () => list() });

  const byKey = (k: string) => (data?.find(r => r.key === k)?.value ?? {}) as Record<string, unknown>;

  const [hero, setHero] = useState<Hero>({});
  const [contact, setContact] = useState<Contact>({});
  const [about, setAbout] = useState<About>({});

  useEffect(() => {
    if (data) {
      setHero(byKey("hero") as Hero);
      setContact(byKey("contact") as Contact);
      setAbout(byKey("about") as About);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const m = useMutation({
    mutationFn: upsert,
    onSuccess: () => { toast.success("已保存"); qc.invalidateQueries({ queryKey: ["admin", "settings"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">站点设置</h1>

      <Card>
        <CardHeader><CardTitle>首页 Hero</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Field label="主标题"><Input value={hero.title ?? ""} onChange={e => setHero({ ...hero, title: e.target.value })} /></Field>
          <Field label="副标题"><Textarea rows={2} value={hero.subtitle ?? ""} onChange={e => setHero({ ...hero, subtitle: e.target.value })} /></Field>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="主按钮文字"><Input value={hero.cta_primary ?? ""} onChange={e => setHero({ ...hero, cta_primary: e.target.value })} /></Field>
            <Field label="次按钮文字"><Input value={hero.cta_secondary ?? ""} onChange={e => setHero({ ...hero, cta_secondary: e.target.value })} /></Field>
          </div>
          <Button onClick={() => m.mutate({ data: { key: "hero", value: hero as unknown as Record<string, unknown> } })} disabled={m.isPending}>保存</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>联系信息</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Field label="邮箱"><Input value={contact.email ?? ""} onChange={e => setContact({ ...contact, email: e.target.value })} /></Field>
          <Field label="联系页简介"><Textarea rows={2} value={contact.intro ?? ""} onChange={e => setContact({ ...contact, intro: e.target.value })} /></Field>
          <Button onClick={() => m.mutate({ data: { key: "contact", value: contact as unknown as Record<string, unknown> } })} disabled={m.isPending}>保存</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>关于我们</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Field label="使命"><Textarea rows={2} value={about.mission ?? ""} onChange={e => setAbout({ ...about, mission: e.target.value })} /></Field>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>能力列表</Label>
              <Button type="button" size="sm" variant="outline" onClick={() => setAbout({ ...about, capabilities: [...(about.capabilities ?? []), ""] })}>
                <Plus size={14} className="mr-1" />添加
              </Button>
            </div>
            {(about.capabilities ?? []).map((cap, i) => (
              <div key={i} className="flex gap-2">
                <Input value={cap} onChange={e => {
                  const n = [...(about.capabilities ?? [])]; n[i] = e.target.value; setAbout({ ...about, capabilities: n });
                }} />
                <Button type="button" size="icon" variant="ghost" onClick={() => setAbout({ ...about, capabilities: (about.capabilities ?? []).filter((_, x) => x !== i) })}>
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={() => m.mutate({ data: { key: "about", value: about as unknown as Record<string, unknown> } })} disabled={m.isPending}>保存</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
