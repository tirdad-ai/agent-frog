"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const router = useRouter();
  const t = useTranslations("auth");

  useEffect(() => {
    console.log("Auth error page - error:", error);

    // If no error or undefined, redirect to login
    if (!error || error === "undefined") {
      console.log("No real error, redirecting to login");
      router.push("/auth/login");
    }
  }, [error, router]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm text-center space-y-4">
        <h1 className="text-2xl font-bold">{t("generic_error")}</h1>
        <p className="text-muted-foreground">
          {error === "undefined" || !error
            ? t("signing_in")
            : `${t("generic_error")}: ${error}`}
        </p>
        <a href="/auth/login" className="text-primary underline">
          {t("back_to_login")}
        </a>
      </div>
    </div>
  );
}
