"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@repo/ui/components/base/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/base/card";
import { AlertCircle } from "lucide-react";

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
};

interface AuthErrorProps {
  // Link component for navigation (supports i18n routing)
  LinkComponent?: React.ComponentType<any>;
}

export function AuthError({ LinkComponent }: AuthErrorProps) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const message =
    error && error in errorMessages
      ? errorMessages[error]
      : errorMessages.Default;

  const LinkWrapper =
    LinkComponent ||
    (({ href, children, className }: any) => (
      <a href={href} className={className}>
        {children}
      </a>
    ));

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle>Authentication Error</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Please try signing in again. If the problem persists, contact support.
        </p>
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <LinkWrapper href="/auth/login">Back to Sign In</LinkWrapper>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <LinkWrapper href="/">Go to Home</LinkWrapper>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
