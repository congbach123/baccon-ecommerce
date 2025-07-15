import React, { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, Lock } from "lucide-react";

const stripePromise = loadStripe(
  // "pk_test_51QTys5P0HIIDl81RluydhHwioBALCdQzl8cZ4QLFjpAOGLP0THRgpV1U2fTuCE7XvaUhIpJLbfPFYcJ3tWyuFmsF00zTCnyixi"
  process.env.REACT_APP_STRIPE_PUBLIC_KEY
);

const PaymentForm = ({
  orderId,
  totalAmount,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setPaymentError(null);

    try {
      // Create payment intent
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on your auth setup
        },
        body: JSON.stringify({ orderId }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        setPaymentError(error.message);
        onPaymentError(error);
      } else if (paymentIntent.status === "succeeded") {
        // Update order status via your existing API
        const updateResponse = await fetch(`/api/orders/${orderId}/pay`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            paymentMethod: "stripe",
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status,
            amount_paid: paymentIntent.amount / 100,
          }),
        });

        if (updateResponse.ok) {
          onPaymentSuccess(paymentIntent);
        } else {
          throw new Error("Failed to update order status");
        }
      }
    } catch (error) {
      setPaymentError(error.message);
      onPaymentError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Card Information</span>
        </div>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                fontFamily: "Inter, sans-serif",
                color: "#374151",
                "::placeholder": {
                  color: "#9CA3AF",
                },
              },
            },
          }}
        />
      </div>

      {paymentError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{paymentError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay ${totalAmount.toFixed(2)}
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
        <Lock className="w-3 h-3" />
        <span>Secured by Stripe</span>
      </div>
    </form>
  );
};

const StripePayment = ({
  orderId,
  totalAmount,
  onPaymentSuccess,
  onPaymentError,
}) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        orderId={orderId}
        totalAmount={totalAmount}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
      />
    </Elements>
  );
};

export default StripePayment;
