import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const RESET_REDIRECT_URL =
  "https://forgot-password.lioneapps.com/update-password";

export const Route = createFileRoute("/forgot-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "找回密码 — LioneApps 密码中心" },
      { name: "description", content: "LioneApps 统一密码找回中心" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    return: typeof search.return === "string" ? search.return : undefined,
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { return: returnUrl } = useSearch({ from: "/forgot-password" });
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const redirectTo = returnUrl
        ? `${RESET_REDIRECT_URL}?return=${encodeURIComponent(returnUrl)}`
        : RESET_REDIRECT_URL;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
      setSent(true);
      toast.success("密码重置邮件已发送，请检查邮箱。");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Toaster richColors position="top-center" />
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">找回密码</CardTitle>
          <p className="text-sm text-muted-foreground">
            输入您的注册邮箱，我们会发送密码重置链接
          </p>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-center">
              <div className="text-5xl">✉️</div>
              <p className="text-sm text-muted-foreground">
                重置邮件已发送至 <span className="font-medium text-foreground">{email}</span>
                <br />请检查邮箱并点击链接重置密码。
              </p>
              <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
                重新发送
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "发送中…" : "发送重置邮件"}
              </Button>
              <div className="text-center text-sm">
                <Link to="/auth" className="text-muted-foreground hover:text-foreground">
                  返回登录
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
