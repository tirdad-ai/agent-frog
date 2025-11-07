"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@repo/ui/components/base/button";
import { Input } from "@repo/ui/components/base/input";
import { Label } from "@repo/ui/components/base/label";
import type { ValidationMessages } from "../lib/auth-utils";

const createForgotPasswordSchema = (messages?: ValidationMessages) =>
  z.object({
    email: z.string().email(messages?.email_invalid || "Invalid email address"),
  });

type ForgotPasswordInput = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

interface ForgotPasswordFormProps {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onBackToLogin?: () => void;
  locale?: string;
  t?: {
    forgot_password?: string;
    forgot_password_subtitle?: string;
    email?: string;
    send_reset_link?: string;
    sending?: string;
    back_to_login?: string;
    reset_link_sent?: string;
  };
  tErrors?: {
    email_not_found?: string;
    network_error?: string;
    invalid_request?: string;
  };
  tValidation?: ValidationMessages;
  LinkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    children: React.ReactNode;
  }>;
}

export function ForgotPasswordForm({
  onSuccess,
  onError,
  onBackToLogin,
  locale = "en",
  t = {},
  tErrors = {},
  tValidation = {},
  LinkComponent,
}: ForgotPasswordFormProps) {
  const schema = createForgotPasswordSchema(tValidation);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors: fieldErrors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, locale }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Translate error key to message
        const errorKey = result.error;
        const errorMsg =
          tErrors[errorKey as keyof typeof tErrors] ||
          tErrors.network_error ||
          "Failed to send reset link";
        if (onError) {
          onError(errorMsg);
        }
        return;
      }

      // Translate success key to message
      const successKey = result.message;
      const successMsg =
        t[successKey as keyof typeof t] ||
        t.reset_link_sent ||
        "If an account exists with that email, you will receive a password reset link.";
      if (onSuccess) {
        onSuccess(successMsg);
      }
    } catch (err) {
      const errorMsg =
        tErrors.network_error || "Network error. Please try again.";
      if (onError) {
        onError(errorMsg);
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          {t.forgot_password || "Forgot password?"}
        </h1>
        <p className="text-muted-foreground">
          {t.forgot_password_subtitle ||
            "Enter your email and we'll send you a reset link"}
        </p>
      </div>

      <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t.email || "Email"}</Label>
          <Input
            id="email"
            type="email"
            placeholder="ahmed@example.com"
            {...register("email")}
            disabled={isSubmitting}
            autoComplete="email"
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && (
            <p className="text-sm text-destructive">
              {fieldErrors.email.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? t.sending || "Sending..."
            : t.send_reset_link || "Send reset link"}
        </Button>
      </form>

      <div className="text-center text-sm">
        {LinkComponent ? (
          <LinkComponent
            href="/auth/login"
            className="text-primary hover:underline font-semibold"
          >
            {t.back_to_login || "Back to login"}
          </LinkComponent>
        ) : (
          <button
            onClick={onBackToLogin}
            className="text-primary hover:underline font-semibold"
            disabled={isSubmitting}
          >
            {t.back_to_login || "Back to login"}
          </button>
        )}
      </div>
    </div>
  );
}
