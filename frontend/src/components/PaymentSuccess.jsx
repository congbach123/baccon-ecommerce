import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Check, AlertCircle, ArrowRight, Package } from "lucide-react";

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);
  const [confirmationStatus, setConfirmationStatus] = useState(null);
  const [error, setError] = useState("");

  const user = useSelector((state) => state.auth?.userInfo);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const confirmPayment = async () => {
      console.log("PaymentSuccess - Confirming payment...");
      console.log("Session ID:", sessionId);
      console.log("Order ID:", orderId);
      console.log("User:", user ? "Present" : "Missing");

      if (!sessionId || !orderId || !user) {
        const missingItems = [];
        if (!sessionId) missingItems.push("session_id");
        if (!orderId) missingItems.push("orderId");
        if (!user) missingItems.push("user");

        setError(`Missing payment information: ${missingItems.join(", ")}`);
        setIsConfirming(false);
        return;
      }

      try {
        console.log("Calling confirm payment API...");
        const response = await fetch(`/api/orders/${orderId}/confirm-payment`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to confirm payment");
        }

        console.log("Payment confirmation successful!");
        setConfirmationStatus("success");
      } catch (error) {
        console.error("Payment confirmation error:", error);
        setError(error.message || "Failed to confirm payment");
        setConfirmationStatus("error");
      } finally {
        setIsConfirming(false);
      }
    };

    confirmPayment();
  }, [sessionId, orderId, user]);

  const handleViewOrder = () => {
    navigate(`/orders/${orderId}`);
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (isConfirming) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Confirming Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (confirmationStatus === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Payment Confirmation Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {error ||
                "There was an issue confirming your payment. Please contact support."}
            </p>
            <div className="space-y-3">
              <button
                onClick={handleViewOrder}
                className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                View Order Details
              </button>
              <button
                onClick={handleContinueShopping}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your payment. Your order has been confirmed and will
            be processed shortly.
          </p>

          {/* Order Information */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Order ID</span>
            </div>
            <code className="text-sm font-mono text-gray-700 bg-white px-2 py-1 rounded">
              {orderId}
            </code>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleViewOrder}
              className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              View Order Details
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {/* Additional Information */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800">
              📧 A confirmation email has been sent to your registered email
              address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
