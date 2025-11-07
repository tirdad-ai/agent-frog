"use client";

import React from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentMethodFormProps,
  PaymentMethodFormRef,
} from "./payment-method-form";
import { Alert, AlertDescription } from "../base/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface StripeFormProps extends Omit<PaymentMethodFormProps, "gateway"> {
  ref?: React.RefObject<PaymentMethodFormRef>;
}

/**
 * Inner form component that uses Stripe hooks
 * Must be wrapped in <Elements> provider
 */
const StripePaymentFormInnerBase = React.forwardRef<
  PaymentMethodFormRef,
  Omit<StripeFormProps, "publishableKey">
>(({ onToken, onError, isProcessing }, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isReady, setIsReady] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  // Expose submit method to parent
  React.useImperativeHandle(ref, () => ({
    submit: async () => {
      if (!stripe || !elements) {
        const error = "Payment form not loaded. Please refresh the page.";
        setLocalError(error);
        onError(error);
        return;
      }

      setLocalError(null);

      try {
        // Get card element
        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
          const error = "Card element not found. Please refresh the page.";
          setLocalError(error);
          onError(error);
          return;
        }

        // Create token with card element (Kill Bill Stripe plugin expects tokens, not payment methods)
        const { error: tokenError, token } =
          await stripe.createToken(cardElement);

        if (tokenError) {
          setLocalError(tokenError.message || "Failed to create token");
          onError(tokenError.message || "Failed to create token");
          return;
        }

        if (!token) {
          setLocalError("No token returned from Stripe");
          onError("No token returned from Stripe");
          return;
        }

        // Return the token ID (tok_xxx)
        onToken(token.id);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setLocalError(errorMessage);
        onError(errorMessage);
      }
    },
  }));

  return (
    <div className="space-y-4">
      {localError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{localError}</AlertDescription>
        </Alert>
      )}

      <div className="min-h-[80px] relative">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        <CardElement
          onReady={() => setIsReady(true)}
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#0F172A",
                fontFamily: "system-ui, sans-serif",
                "::placeholder": {
                  color: "#94a3b8",
                },
              },
              invalid: {
                color: "#EF4444",
              },
            },
          }}
        />
      </div>

      {isProcessing && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing payment...</span>
        </div>
      )}
    </div>
  );
});

StripePaymentFormInnerBase.displayName = "StripePaymentFormInnerBase";

// Memoize to prevent unnecessary re-renders that could unmount CardElement
const StripePaymentFormInner = React.memo(StripePaymentFormInnerBase);

/**
 * Stripe Payment Element Component
 *
 * Uses Stripe Elements to collect payment information securely.
 * No PCI compliance needed - Stripe handles all sensitive data.
 *
 * Flow:
 * 1. User fills out the Stripe Elements form
 * 2. On submit, Stripe tokenizes the payment method
 * 3. Token (payment method ID) is returned to parent
 * 4. Parent sends token to backend to create payment method in Kill Bill
 */
const StripePaymentElement = React.forwardRef<
  PaymentMethodFormRef,
  StripeFormProps
>(({ publishableKey, onToken, onError, isProcessing }, ref) => {
  const [stripePromise] = React.useState(() => loadStripe(publishableKey));

  // Using CardElement instead of PaymentElement for simpler integration
  // No SetupIntent needed - we can create payment methods directly
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentFormInner
        onToken={onToken}
        onError={onError}
        isProcessing={isProcessing}
        ref={ref}
      />
    </Elements>
  );
});

StripePaymentElement.displayName = "StripePaymentElement";

export default StripePaymentElement;
