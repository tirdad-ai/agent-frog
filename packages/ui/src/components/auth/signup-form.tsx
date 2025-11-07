"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Layers } from "lucide-react";
import { Button } from "../base/button";
import { Input } from "../base/input";
import { Label } from "../base/label";
import { cn } from "@repo/ui/lib/utils";

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => Promise<{ error?: string }>;
  className?: string;
  translations?: {
    title?: string;
    subtitle?: string;
    fullName?: string;
    email?: string;
    company?: string;
    password?: string;
    terms?: string;
    termsLink?: string;
    createButton?: string;
    creatingButton?: string;
    haveAccount?: string;
    signInLink?: string;
    validation?: {
      emailInvalid?: string;
      emailRequired?: string;
      passwordRequired?: string;
      passwordMinLength?: string;
      passwordComplexity?: string;
      nameRequired?: string;
      nameMinLength?: string;
      nameMaxLength?: string;
      companyRequired?: string;
      companyMinLength?: string;
      companyMaxLength?: string;
      termsRequired?: string;
    };
    errorGeneric?: string;
  };
}

export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  company: string;
  terms: boolean;
}

const createSignupSchema = (validation: any) =>
  Yup.object().shape({
    name: Yup.string()
      .min(2, validation.nameMinLength)
      .max(100, validation.nameMaxLength)
      .required(validation.nameRequired),
    email: Yup.string()
      .email(validation.emailInvalid)
      .required(validation.emailRequired),
    password: Yup.string()
      .min(8, validation.passwordMinLength)
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, validation.passwordComplexity)
      .required(validation.passwordRequired),
    company: Yup.string()
      .min(2, validation.companyMinLength)
      .max(100, validation.companyMaxLength)
      .required(validation.companyRequired),
    terms: Yup.boolean()
      .oneOf([true], validation.termsRequired)
      .required(validation.termsRequired),
  });

export function SignupForm({
  onSubmit,
  className,
  translations,
}: SignupFormProps) {
  const t = {
    title: translations?.title || "Create an account",
    subtitle: translations?.subtitle || "Enter your information to get started",
    fullName: translations?.fullName || "Full Name",
    email: translations?.email || "Email",
    company: translations?.company || "Company Name",
    password: translations?.password || "Password",
    terms: translations?.terms || "I agree to the",
    termsLink: translations?.termsLink || "terms and conditions",
    createButton: translations?.createButton || "Create account",
    creatingButton: translations?.creatingButton || "Creating account...",
    haveAccount: translations?.haveAccount || "Already have an account?",
    signInLink: translations?.signInLink || "Sign in",
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
      passwordComplexity:
        translations?.validation?.passwordComplexity ||
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number",
      nameRequired:
        translations?.validation?.nameRequired || "Full name is required",
      nameMinLength:
        translations?.validation?.nameMinLength ||
        "Name must be at least 2 characters",
      nameMaxLength:
        translations?.validation?.nameMaxLength ||
        "Name must be less than 100 characters",
      companyRequired:
        translations?.validation?.companyRequired || "Company name is required",
      companyMinLength:
        translations?.validation?.companyMinLength ||
        "Company name must be at least 2 characters",
      companyMaxLength:
        translations?.validation?.companyMaxLength ||
        "Company name must be less than 100 characters",
      termsRequired:
        translations?.validation?.termsRequired ||
        "You must accept the terms and conditions",
    },
    errorGeneric:
      translations?.errorGeneric || "An error occurred. Please try again.",
  };

  const initialValues: SignupFormValues = {
    name: "",
    email: "",
    password: "",
    company: "",
    terms: false,
  };

  const handleSubmit = async (
    values: SignupFormValues,
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
        validationSchema={createSignupSchema(t.validation)}
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
                  <Label htmlFor="name">{t.fullName}</Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="name">
                    {(msg) => <p className="text-sm text-destructive">{msg}</p>}
                  </ErrorMessage>
                </div>

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
                  <Label htmlFor="company">{t.company}</Label>
                  <Field
                    as={Input}
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Acme Inc."
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="company">
                    {(msg) => <p className="text-sm text-destructive">{msg}</p>}
                  </ErrorMessage>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">{t.password}</Label>
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

                <div className="flex items-center space-x-2">
                  <Field
                    type="checkbox"
                    id="terms"
                    name="terms"
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="terms" className="text-sm font-normal">
                    {t.terms}{" "}
                    <a href="/terms" className="underline hover:text-primary">
                      {t.termsLink}
                    </a>
                  </Label>
                </div>
                <ErrorMessage name="terms">
                  {(msg) => <p className="text-sm text-destructive">{msg}</p>}
                </ErrorMessage>

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
                  {isSubmitting ? t.creatingButton : t.createButton}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        {t.haveAccount} <a href="/auth/login">{t.signInLink}</a>
      </div>
    </div>
  );
}
