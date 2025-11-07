"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/base/button";
import { Input } from "@repo/ui/components/base/input";
import { Label } from "@repo/ui/components/base/label";
import { Alert, AlertDescription } from "@repo/ui/components/base/alert";
import { AlertCircle, X } from "lucide-react";

import {
  createLoginSchema,
  type LoginInput,
  type ValidationMessages,
} from "../lib/auth-utils";

interface LoginFormProps {
  callbackUrl?: string;
  showSignUp?: boolean;
  onSignUpClick?: () => void;
  // Optional callback for centralized error handling (e.g., toast)
  onError?: (message: string) => void;
  // Optional callback for successful login (for custom redirect logic)
  onSuccess?: () => void | Promise<void>;
  // i18n translation functions
  t?: {
    welcome_back?: string;
    login_subtitle?: string;
    email?: string;
    password?: string;
    forgot_password?: string;
    signing_in?: string;
    sign_in?: string;
    dont_have_account?: string;
    dont_have_account_cta?: string;
  };
  tErrors?: {
    rate_limit_exceeded?: string;
    invalid_credentials?: string;
    network_error?: string;
  };
  // Validation error messages
  tValidation?: ValidationMessages;
  // Link component for navigation (supports i18n routing)
  LinkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    children: React.ReactNode;
  }>;
}

export function LoginForm({
  callbackUrl = "/",
  showSignUp = true,
  onSignUpClick,
  onError,
  onSuccess,
  t = {},
  tErrors = {},
  tValidation = {},
  LinkComponent,
}: LoginFormProps) {
  const router = useRouter();
  const schema = createLoginSchema(tValidation);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors: fieldErrors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Check for specific error types
        const errorMsg = result.error.includes("rate")
          ? tErrors.rate_limit_exceeded ||
            "Too many attempts. Please try again later."
          : tErrors.invalid_credentials || "Invalid email or password";

        // Use onError callback if provided
        if (onError) {
          onError(errorMsg);
        }
      } else {
        // Use onSuccess callback if provided for custom redirect logic
        if (onSuccess) {
          await onSuccess();
        } else {
          // Default redirect behavior
          router.push(callbackUrl);
          router.refresh();
        }
      }
    } catch (err: unknown) {
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
          {t.welcome_back || "Welcome back"}
        </h1>
        <p className="text-muted-foreground">
          {t.login_subtitle || "Sign in to your account to continue"}
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t.password || "Password"}</Label>
            {LinkComponent ? (
              <LinkComponent
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                {t.forgot_password || "Forgot password?"}
              </LinkComponent>
            ) : (
              <a
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                {t.forgot_password || "Forgot password?"}
              </a>
            )}
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            disabled={isSubmitting}
            autoComplete="current-password"
            aria-invalid={!!fieldErrors.password}
          />
          {fieldErrors.password && (
            <p className="text-sm text-destructive">
              {fieldErrors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? t.signing_in || "Signing in..."
            : t.sign_in || "Sign in"}
        </Button>
      </form>

      {showSignUp && (
        <div className="text-center text-sm text-muted-foreground">
          {t.dont_have_account || "Don't have an account?"}{" "}
          <Button
            variant="link"
            className="h-auto p-0 text-primary font-semibold hover:underline"
            onClick={onSignUpClick}
            disabled={isSubmitting}
          >
            {t.dont_have_account_cta || "Create account"}
          </Button>
        </div>
      )}
    </div>
  );
}
