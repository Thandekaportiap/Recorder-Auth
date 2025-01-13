// components/ProtectedRoute.tsx
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../app/context/AuthContext";
import { useRouter } from "expo-router";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.replace("/auth/login");
    return null;
  }

  return children;
}
