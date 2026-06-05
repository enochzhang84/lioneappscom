import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Lione Apps Admin" }] }),
  component: () => <Outlet />,
});
