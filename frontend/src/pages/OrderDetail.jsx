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
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  const handlePaymentSuccess = (paymentIntent) => {
    setPaymentSuccess(true);
    setShowPayment(false);
    refetch(); // Refresh order data
    // You can add a success toast here
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    // You can add an error toast here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => {
              // In your actual implementation: navigate(-1);
              console.log("Navigate back");
            }}
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
                    Credit/Debit Card
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

                {/* Stripe Payment Integration */}
                {!order.isPaid && (
                  <div className="space-y-4">
                    {!showPayment ? (
                      <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl text-center">
                        <p className="text-gray-600 mb-4">
                          Complete your payment to process the order
                        </p>
                        <button
                          onClick={() => setShowPayment(true)}
                          className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-charcoal transition-colors"
                        >
                          Pay ${order.totalPrice.toFixed(2)}
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 border border-gray-300 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">
                            Complete Payment
                          </h3>
                          <button
                            onClick={() => setShowPayment(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                        {/* <StripePayment
                          orderId={order._id}
                          totalAmount={order.totalPrice}
                          onPaymentSuccess={handlePaymentSuccess}
                          onPaymentError={handlePaymentError}
                        /> */}
                      </div>
                    )}
                  </div>
                )}

                {paymentSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">
                        Payment successful! Your order has been updated.
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
              {!order.isPaid && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-charcoal transition-colors"
                  >
                    Pay Now - ${order.totalPrice.toFixed(2)}
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
