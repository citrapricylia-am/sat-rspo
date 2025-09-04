// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type Props = { children: JSX.Element };

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // TUNGGU auth selesai dulu (bisa ganti dengan spinner)
  if (loading) return null;

  // IZINKAN jika sudah ada user; jika tidak, redirect ke login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
