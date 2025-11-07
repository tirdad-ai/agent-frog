"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@repo/ui/components/base/button";
import { Input } from "@repo/ui/components/base/input";
import { Label } from "@repo/ui/components/base/label";
import type { ValidationMessages } from "../lib/auth-utils";

interface ResetPasswordFormProps {
  token: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  t?: {
    reset_password?: string;
    reset_password_subtitle?: string;
    new_password?: string;
    confirm_password?: string;
    reset_password_button?: string;
    resetting?: string;
    password_reset_success?: string;
  };
  tErrors?: {
    passwords_no_match?: string;
    invalid_token?: string;
    invalid_request?: string;
    network_error?: string;
    password_min_register?: string;
  };
  tValidation?: ValidationMessages;
}

export function ResetPasswordForm({
  token,
  onSuccess,
  onError,
  t = {},
  tErrors = {},
  tValidation = {},
}: ResetPasswordFormProps) {
  const schema = z
    .object({
      password: z
        .string()
        .min(
          8,
          tValidation?.password_min_register ||
            "Password must be at least 8 characters",
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: tErrors.passwords_no_match || "Passwords do not match",
      path: ["confirmPassword"],
    });

  type ResetPasswordInput = z.infer<typeof schema>;

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors: fieldErrors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Translate error key to message
        const errorKey = result.error;
        const errorMsg =
          tErrors[errorKey as keyof typeof tErrors] ||
          tErrors.invalid_token ||
          "Failed to reset password";
        if (onError) {
          onError(errorMsg);
        }
        return;
      }

      // Translate success key to message
      const successKey = result.message;
      const successMsg =
        t[successKey as keyof typeof t] ||
        t.password_reset_success ||
        "Password reset successfully";
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
          {t.reset_password || "Reset password"}
        </h1>
        <p className="text-muted-foreground">
          {t.reset_password_subtitle || "Enter your new password"}
        </p>
      </div>

      <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">{t.new_password || "New password"}</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter new password"
            {...register("password")}
            disabled={isSubmitting}
            autoComplete="new-password"
            aria-invalid={!!fieldErrors.password}
          />
          {fieldErrors.password && (
            <p className="text-sm text-destructive">
              {fieldErrors.password.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            {t.confirm_password || "Confirm password"}
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter new password"
            {...register("confirmPassword")}
            disabled={isSubmitting}
            autoComplete="new-password"
            aria-invalid={!!fieldErrors.confirmPassword}
          />
          {fieldErrors.confirmPassword && (
            <p className="text-sm text-destructive">
              {fieldErrors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? t.resetting || "Resetting..."
            : t.reset_password_button || "Reset password"}
        </Button>
      </form>
    </div>
  );
}
