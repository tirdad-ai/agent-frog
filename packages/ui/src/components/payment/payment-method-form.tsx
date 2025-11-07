"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../base/card";
import { Alert, AlertDescription } from "../base/alert";
import { AlertCircle } from "lucide-react";

export type PaymentGateway = "stripe" | "hyperpay" | "moyasar" | "tap";

export interface PaymentMethodFormProps {
  gateway: PaymentGateway;
  publishableKey: string;
  onToken: (token: string) => void;
  onError: (error: string) => void;
  isProcessing?: boolean;
}

export interface PaymentMethodFormRef {
  submit: () => Promise<void>;
}

/**
 * Unified Payment Method Form
 *
 * Renders the appropriate gateway-specific payment form based on the selected gateway.
 * Each gateway uses its own SDK to handle tokenization securely (no PCI compliance needed).
 *
 * Supported Gateways:
 * - Stripe (using Stripe Elements)
 * - HyperPay (future - using Copy & Pay widget)
 * - Moyasar (future - using Moyasar.js)
 * - Tap Payments (future - using Tap SDK)
 */
export const PaymentMethodForm = React.forwardRef<
  PaymentMethodFormRef,
  PaymentMethodFormProps
>(({ gateway, publishableKey, onToken, onError, isProcessing }, ref) => {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    onError(errorMessage);
  };

  const clearError = () => {
    setError(null);
  };

  // Expose submit method via ref
  React.useImperativeHandle(ref, () => ({
    submit: async () => {
      // Will be implemented by gateway-specific components
      throw new Error("Submit method not implemented for selected gateway");
    },
  }));

  const renderGatewayForm = () => {
    switch (gateway) {
      case "stripe":
        // Import dynamically to avoid loading all gateway SDKs
        const StripePaymentElement = React.lazy(
          () => import("./stripe-payment-element"),
        );
        return (
          <React.Suspense fallback={<div>Loading payment form...</div>}>
            <StripePaymentElement
              publishableKey={publishableKey}
              onToken={onToken}
              onError={handleError}
              isProcessing={isProcessing || loading}
              ref={ref as React.RefObject<PaymentMethodFormRef>}
            />
          </React.Suspense>
        );

      case "hyperpay":
        return (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              HyperPay integration coming soon. This gateway will use the Copy &
              Pay widget.
            </AlertDescription>
          </Alert>
        );

      case "moyasar":
        return (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Moyasar integration coming soon. This gateway will use Moyasar.js
              SDK.
            </AlertDescription>
          </Alert>
        );

      case "tap":
        return (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Tap Payments integration coming soon. This gateway will use Tap
              SDK.
            </AlertDescription>
          </Alert>
        );

      default:
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unsupported payment gateway: {gateway}
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Enter your payment details to complete your subscription. Your
          information is secure and encrypted.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {renderGatewayForm()}
      </CardContent>
    </Card>
  );
});

PaymentMethodForm.displayName = "PaymentMethodForm";
