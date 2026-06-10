import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/success")({
  ssr: false,
  head: () => ({ meta: [{ title: "密码已重置 — LioneApps 密码中心" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    return: typeof search.return === "string" ? search.return : undefined,
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { return: returnUrl } = useSearch({ from: "/success" });
  const loginHref = returnUrl ?? "/auth";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardContent className="space-y-6 py-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl">
            ✓
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">密码已成功重置</h1>
            <p className="text-sm text-muted-foreground">
              请使用新密码登录您的账户。
            </p>
          </div>
          <Button asChild className="w-full">
            <a href={loginHref}>返回登录页</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
