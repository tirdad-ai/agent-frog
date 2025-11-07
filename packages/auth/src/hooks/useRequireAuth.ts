"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

interface UseRequireAuthOptions {
  redirectTo?: string;
  onUnauthorized?: () => void;
}

export function useRequireAuth({
  redirectTo = "/auth/signin",
  onUnauthorized,
}: UseRequireAuthOptions = {}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        router.push(
          `${redirectTo}?callbackUrl=${encodeURIComponent(window.location.href)}`,
        );
      }
    }
  }, [isLoading, isAuthenticated, redirectTo, onUnauthorized, router]);

  return {
    user,
    isLoading,
    isAuthenticated,
  };
}
