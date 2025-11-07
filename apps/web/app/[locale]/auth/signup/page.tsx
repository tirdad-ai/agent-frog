"use client";

import {
  SignupForm,
  type SignupFormValues,
} from "@repo/ui/components/auth/signup-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToastContext } from "@repo/ui";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslations } from "next-intl";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToastContext();
  const t = useTranslations("auth");

  const handleSignup = async (
    values: SignupFormValues,
  ): Promise<{ error?: string }> => {
    try {
      // Step 1: Create account
      const response = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error?.message || "Signup failed" };
      }

      // Show success toast
      toast({
        title: t("account_created_success"),
        description: t("signing_in"),
        variant: "default",
      });

      // Step 2: Auto-login via NextAuth
      console.log("Attempting auto-login with:", { email: values.email });
      const loginResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      console.log("Login result:", JSON.stringify(loginResult, null, 2));

      // NextAuth returns null on error, or { error, status, ok, url } on success
      if (!loginResult) {
        console.error(
          "Login result is null - session created but response failed",
        );
        // Session might still be created, redirect to dashboard
        toast({
          title: t("welcome_back"),
          description: t("signing_in"),
          variant: "default",
        });
        setTimeout(() => router.push("/dashboard"), 500);
        return {};
      }

      if (loginResult.error) {
        // Signup succeeded but auto-login failed
        console.error("Auto-login failed:", loginResult.error);
        toast({
          title: t("account_created_success"),
          description: t("auto_signin_failed"),
          variant: "destructive",
        });
        setTimeout(() => router.push("/auth/login"), 2000);
        return {};
      }

      // Success - loginResult.ok should be true
      if (loginResult.ok) {
        toast({
          title: t("welcome_back"),
          description: t("signing_in"),
          variant: "default",
        });
        setTimeout(() => router.push("/dashboard"), 500);
        return {};
      }

      // Unexpected state
      console.error("Unexpected login result:", loginResult);
      return { error: t("generic_error") };
    } catch (error) {
      return { error: t("generic_error") };
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <SignupForm
          onSubmit={handleSignup}
          translations={{
            title: t("create_account"),
            subtitle: t("create_account_subtitle"),
            fullName: t("full_name"),
            email: t("email"),
            company: t("company_name"),
            password: t("password"),
            terms: t("terms_and_conditions"),
            termsLink: t("terms_and_conditions_link"),
            createButton: t("sign_up"),
            creatingButton: t("creating_account"),
            haveAccount: t("already_have_account"),
            signInLink: t("already_have_account_cta"),
            validation: {
              emailInvalid: t("validation.email_invalid"),
              emailRequired: t("validation.email_required"),
              passwordRequired: t("validation.password_required"),
              passwordMinLength: t("validation.password_min_length"),
              passwordComplexity: t("validation.password_complexity"),
              nameRequired: t("validation.name_required"),
              nameMinLength: t("validation.name_min_length"),
              nameMaxLength: t("validation.name_max_length"),
              companyRequired: t("validation.company_required"),
              companyMinLength: t("validation.company_min_length"),
              companyMaxLength: t("validation.company_max_length"),
              termsRequired: t("validation.terms_required"),
            },
            errorGeneric: t("generic_error"),
          }}
        />
      </div>
    </div>
  );
}
