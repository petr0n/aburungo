import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/store/auth";

export function ProtectedRoute() {
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);

  if (loading) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-zinc-500">Loading…</p>
      </main>
    );
  }

  if (user === null) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
