"use client";

import {
  LoginForm,
  type LoginFormValues,
} from "@repo/ui/components/auth/login-form";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToastContext } from "@repo/ui";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const message = searchParams.get("message");
  const { toast } = useToastContext();
  const t = useTranslations("auth");

  // Show message from query params (e.g., after signup)
  useEffect(() => {
    if (message) {
      toast({
        description: message,
        variant: "default",
      });
    }
  }, [message, toast]);

  const handleLogin = async (
    values: LoginFormValues,
  ): Promise<{ error?: string }> => {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      return { error: t("generic_error") };
    } else if (result?.ok) {
      toast({
        title: t("welcome_back"),
        description: t("signing_in"),
        variant: "default",
      });
      setTimeout(() => router.push(callbackUrl), 500);
      return {};
    }

    return { error: t("generic_error") };
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <LoginForm
          onSubmit={handleLogin}
          translations={{
            title: t("welcome_back"),
            subtitle: t("login_subtitle"),
            email: t("email"),
            password: t("password"),
            forgotPassword: t("forgot_password"),
            loginButton: t("sign_in"),
            loggingIn: t("signing_in"),
            noAccount: t("dont_have_account"),
            signUpLink: t("dont_have_account_cta"),
            validation: {
              emailInvalid: t("validation.email_invalid"),
              emailRequired: t("validation.email_required"),
              passwordRequired: t("validation.password_required"),
              passwordMinLength: t("validation.password_min_length"),
            },
            errorGeneric: t("generic_error"),
          }}
        />
      </div>
    </div>
  );
}
