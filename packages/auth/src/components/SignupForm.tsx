"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/base/button";
import { Input } from "@repo/ui/components/base/input";
import { Label } from "@repo/ui/components/base/label";
import { Alert } from "@repo/ui/components/base/alert";
import { z } from "zod";

import {
  createRegisterSchema,
  type RegisterInput,
  type ValidationMessages,
} from "../lib/auth-utils";

interface SignupFormProps {
  callbackUrl?: string;
  showSignIn?: boolean;
  onSignInClick?: () => void;
  // Optional callbacks for centralized error/success handling (e.g., toast)
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
  // i18n translation functions
  t?: {
    create_account?: string;
    create_account_subtitle?: string;
    full_name?: string;
    email?: string;
    password?: string;
    confirm_password?: string;
    creating_account?: string;
    account_created_success?: string;
    already_have_account?: string;
    already_have_account_cta?: string;
  };
  tErrors?: {
    passwords_no_match?: string;
    email_already_exists?: string;
    registration_failed?: string;
    generic_error?: string;
  };
  // Validation error messages
  tValidation?: ValidationMessages;
  // Link component for navigation (supports i18n routing)
  LinkComponent?: React.ComponentType<any>;
}

export function SignupForm({
  callbackUrl = "/",
  showSignIn = true,
  onSignInClick,
  onError,
  onSuccess,
  t = {},
  tErrors = {},
  tValidation = {},
  LinkComponent = "a" as any,
}: SignupFormProps) {
  const router = useRouter();

  // Create schema with custom confirmPassword validation
  const baseSchema = createRegisterSchema(tValidation);
  const schema = baseSchema
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: tErrors.passwords_no_match || "Passwords do not match",
      path: ["confirmPassword"],
    });

  type SignupFormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors: fieldErrors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Step 1: Register the user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle specific error types
        if (
          responseData.error?.includes("already exists") ||
          responseData.error?.includes("already registered")
        ) {
          throw new Error(
            tErrors.email_already_exists || "This email is already registered",
          );
        }
        throw new Error(
          responseData.error ||
            tErrors.registration_failed ||
            "Registration failed",
        );
      }

      // Step 2: Show success message
      const successMsg =
        t.account_created_success || "Account created successfully!";
      if (onSuccess) {
        onSuccess(successMsg);
      }

      // Step 3: Auto-login the user
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Registration succeeded but login failed - redirect to login
        router.push(`/auth/login?registered=true`);
      } else {
        // Both registration and login succeeded
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : tErrors.generic_error || "An error occurred";
      if (onError) {
        onError(errorMsg);
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          {t.create_account || "Create account"}
        </h1>
        <p className="text-muted-foreground">
          {t.create_account_subtitle ||
            "Get started with your free account today"}
        </p>
      </div>

      <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t.full_name || "Full Name"}</Label>
          <Input
            id="name"
            type="text"
            placeholder="Ahmed Al-Saud"
            {...register("name")}
            disabled={isSubmitting}
            autoComplete="name"
            aria-invalid={!!fieldErrors.name}
            data-testid="name-input"
          />
          {fieldErrors.name && (
            <p className="text-sm text-destructive">
              {fieldErrors.name.message}
            </p>
          )}
        </div>

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
            data-testid="email-input"
          />
          {fieldErrors.email && (
            <p className="text-sm text-destructive">
              {fieldErrors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t.password || "Password"}</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
            {...register("password")}
            disabled={isSubmitting}
            autoComplete="new-password"
            aria-invalid={!!fieldErrors.password}
            data-testid="password-input"
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
            {t.confirm_password || "Confirm Password"}
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            {...register("confirmPassword")}
            disabled={isSubmitting}
            autoComplete="new-password"
            aria-invalid={!!fieldErrors.confirmPassword}
            data-testid="confirm-password-input"
          />
          {fieldErrors.confirmPassword && (
            <p className="text-sm text-destructive">
              {fieldErrors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          data-testid="submit-button"
        >
          {isSubmitting
            ? t.creating_account || "Creating account..."
            : t.create_account || "Create account"}
        </Button>
      </form>

      {showSignIn && (
        <div className="text-center text-sm text-muted-foreground">
          {t.already_have_account || "Already have an account?"}{" "}
          <Button
            variant="link"
            className="h-auto p-0 text-primary font-semibold hover:underline"
            onClick={onSignInClick}
            disabled={isSubmitting}
          >
            {t.already_have_account_cta || "Sign in"}
          </Button>
        </div>
      )}
    </div>
  );
}
