"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Layers } from "lucide-react";
import { Button } from "../base/button";
import { Input } from "../base/input";
import { Label } from "../base/label";
import { cn } from "@repo/ui/lib/utils";

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<{ error?: string }>;
  className?: string;
  translations?: {
    title?: string;
    subtitle?: string;
    email?: string;
    password?: string;
    forgotPassword?: string;
    loginButton?: string;
    loggingIn?: string;
    noAccount?: string;
    signUpLink?: string;
    validation?: {
      emailInvalid?: string;
      emailRequired?: string;
      passwordRequired?: string;
      passwordMinLength?: string;
    };
    errorGeneric?: string;
  };
}

export interface LoginFormValues {
  email: string;
  password: string;
}

const createLoginSchema = (validation: any) =>
  Yup.object().shape({
    email: Yup.string()
      .email(validation.emailInvalid)
      .required(validation.emailRequired),
    password: Yup.string()
      .min(8, validation.passwordMinLength)
      .required(validation.passwordRequired),
  });

export function LoginForm({
  onSubmit,
  className,
  translations,
}: LoginFormProps) {
  const t = {
    title: translations?.title || "Welcome to Tirdad",
    subtitle: translations?.subtitle || "Login to your account",
    email: translations?.email || "Email",
    password: translations?.password || "Password",
    forgotPassword: translations?.forgotPassword || "Forgot password?",
    loginButton: translations?.loginButton || "Login",
    loggingIn: translations?.loggingIn || "Logging in...",
    noAccount: translations?.noAccount || "Don't have an account?",
    signUpLink: translations?.signUpLink || "Sign up",
    validation: {
      emailInvalid:
        translations?.validation?.emailInvalid ||
        "Please enter a valid email address",
      emailRequired:
        translations?.validation?.emailRequired || "Email is required",
      passwordRequired:
        translations?.validation?.passwordRequired || "Password is required",
      passwordMinLength:
        translations?.validation?.passwordMinLength ||
        "Password must be at least 8 characters",
    },
    errorGeneric:
      translations?.errorGeneric || "An error occurred. Please try again.",
  };
  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting, setStatus }: any,
  ) => {
    setStatus(null);

    try {
      const result = await onSubmit(values);

      if (result.error) {
        setStatus({ error: result.error });
      }
    } catch (err) {
      setStatus({ error: t.errorGeneric });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Formik
        initialValues={initialValues}
        validationSchema={createLoginSchema(t.validation)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Layers className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">{t.title}</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  {t.subtitle}
                </p>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="email">
                    {(msg) => <p className="text-sm text-destructive">{msg}</p>}
                  </ErrorMessage>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">{t.password}</Label>
                    <a
                      href="/auth/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      {t.forgotPassword}
                    </a>
                  </div>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="password">
                    {(msg) => <p className="text-sm text-destructive">{msg}</p>}
                  </ErrorMessage>
                </div>

                {status?.error && (
                  <p className="text-sm text-destructive text-center">
                    {status.error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.loggingIn : t.loginButton}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        {t.noAccount} <a href="/auth/signup">{t.signUpLink}</a>
      </div>
    </div>
  );
}
