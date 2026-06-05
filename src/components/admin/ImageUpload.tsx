import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminUploadImage } from "@/lib/cms-admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mediaUrl } from "@/lib/media";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

export function ImageUpload({
  value,
  onChange,
  folder,
  label = "图片",
}: {
  value: string | null | undefined;
  onChange: (v: string | null) => void;
  folder?: string;
  label?: string;
}) {
  const upload = useServerFn(adminUploadImage);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const url = mediaUrl(value);

  async function handleFile(file: File) {
    if (file.size > 4 * 1024 * 1024) {
      toast.error("图片大于 4MB，请压缩后再传");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = () => reject(r.error);
        r.readAsDataURL(file);
      });
      const res = await upload({ data: { filename: file.name, data_url: dataUrl, folder } });
      onChange(res.key);
      toast.success("已上传");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      <div className="flex items-start gap-3">
        <div className="h-24 w-32 rounded-md border border-border bg-muted overflow-hidden grid place-items-center text-xs text-muted-foreground">
          {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : "无图"}
        </div>
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => inputRef.current?.click()}>
              <Upload size={14} className="mr-1" />{busy ? "上传中…" : "上传图片"}
            </Button>
            {value && (
              <Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>
                <X size={14} className="mr-1" />移除
              </Button>
            )}
          </div>
          <Input
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="或粘贴图片 URL / 存储路径"
            className="w-80"
          />
        </div>
      </div>
    </div>
  );
}
