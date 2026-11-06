import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import api from "@/services/api";
import { hasStoredPermissions, setPermissions } from "@/services/permissions";

export default function AuthGuard() {
  const token = localStorage.getItem("access_token");
  const [ready, setReady] = useState(() => !token || hasStoredPermissions());

  useEffect(() => {
    if (!token || hasStoredPermissions()) return undefined;
    let active = true;
    api
      .get("/auth/profile/")
      .then((response) => {
        if (!active) return;
        localStorage.setItem("user_role", response.data.role);
        setPermissions(response.data.permissions);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;
  if (!ready) return null;

  return <Outlet />;
}
