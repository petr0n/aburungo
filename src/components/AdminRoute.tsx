import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/store/auth";

export function AdminRoute() {
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);

  if (loading) return null;

  const isAdmin = (user?.app_metadata as Record<string, unknown> | undefined)?.role === "admin";

  if (!user || !isAdmin) return <Navigate to="/admin" replace />;

  return <Outlet />;
}
