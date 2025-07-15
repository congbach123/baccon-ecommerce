import React, { useState } from "react";
import {
  Package,
  Truck,
  CreditCard,
  MapPin,
  User,
  ShoppingBag,
  Check,
  Clock,
  ArrowLeft,
  Copy,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetOrderDetailsQuery } from "./slices/orderSlice";

const OrderDetail = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const user = useSelector((state) => state.auth?.userInfo);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const copyOrderId = () => {
    navigator.clipboard.writeText(order._id);
    // You can add a toast notification here
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePayNow = async () => {
    if (!user) {
      setPaymentError("You must be logged in to make a payment");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError("");

    try {
      const response = await fetch(
        `/api/orders/${orderId}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create payment session");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(error.message || "Failed to process payment");
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
                Order Details
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-gray-600">Order ID:</p>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                  {order._id}
                </code>
                <button
                  onClick={copyOrderId}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Order placed on</p>
              <p className="font-medium text-gray-900">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Overview */}
            <div className="bg-white rounded-2xl shadow-soft p-6 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Status
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Status */}
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                  <div
                    className={`p-3 rounded-xl ${
                      order.isPaid ? "bg-green-100" : "bg-yellow-100"
                    }`}
                  >
                    <DollarSign
                      className={`w-6 h-6 ${
                        order.isPaid ? "text-green-600" : "text-yellow-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Payment</h3>
                    <div className="flex items-center gap-2">
                      {order.isPaid ? (
                        <>
                          <div className="flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              Paid
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {order.paidAt && formatDate(order.paidAt)}
                          </span>
                        </>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-600">
                            Awaiting Payment
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Status */}
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                  <div
                    className={`p-3 rounded-xl ${
                      order.isDelivered ? "bg-green-100" : "bg-blue-100"
                    }`}
                  >
                    <Truck
                      className={`w-6 h-6 ${
                        order.isDelivered ? "text-green-600" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Delivery</h3>
                    <div className="flex items-center gap-2">
                      {order.isDelivered ? (
                        <>
                          <div className="flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              Delivered
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {order.deliveredAt && formatDate(order.deliveredAt)}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-600">
                              In Transit
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            Est. {formatDate(order.estimatedDelivery)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-soft p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <Package className="w-5 h-5 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Items
                </h2>
              </div>

              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl"
                  >
                    <img
                      src={item.image || "/api/placeholder/80/80"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {item.name}
                      </h4>
                      <p className="text-gray-600">Quantity: {item.qty}</p>
                      <p className="text-gray-600">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-soft p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <MapPin className="w-5 h-5 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Shipping Address
                </h2>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-gray-700">
                    {order.shippingAddress.address}
                  </p>
                  <p className="text-gray-700">
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-700">
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-soft p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <CreditCard className="w-5 h-5 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Credit/Debit Card"}
                  </span>
                  <div
                    className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
                      order.isPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </div>
                </div>

                {/* Payment Action for Non-COD Orders */}
                {!order.isPaid && order.paymentMethod !== "COD" && (
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl text-center">
                      <p className="text-gray-600 mb-4">
                        Complete your payment to process the order
                      </p>
                      {paymentError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-sm">{paymentError}</p>
                        </div>
                      )}
                      <button
                        onClick={handlePayNow}
                        disabled={isProcessingPayment}
                        className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessingPayment ? (
                          <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Processing...
                          </span>
                        ) : (
                          `Pay $${order.totalPrice.toFixed(2)}`
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* COD Information */}
                {order.paymentMethod === "COD" && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Cash on Delivery - Pay when your order arrives
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({order.orderItems.length} items)</span>
                  <span>${order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${order.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${order.taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="mt-6 space-y-3">
                <button className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                  Track Order
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Download Invoice
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Contact Support
                </button>
              </div>

              {/* Quick Payment Button */}
              {!order.isPaid && order.paymentMethod !== "COD" && (
                <div className="mt-6">
                  <button
                    onClick={handlePayNow}
                    disabled={isProcessingPayment}
                    className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessingPayment ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </span>
                    ) : (
                      `Pay Now - $${order.totalPrice.toFixed(2)}`
                    )}
                  </button>
                </div>
              )}

              {/* Estimated Delivery */}
              {!order.isDelivered && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Estimated Delivery
                    </span>
                  </div>
                  <p className="text-blue-800 text-sm">
                    {formatDate(order.estimatedDelivery)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
