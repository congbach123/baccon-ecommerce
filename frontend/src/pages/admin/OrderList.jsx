import React from "react";
import { useGetAllOrdersQuery } from "../slices/orderSlice";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-off-white">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-off-white">
        <div className="text-center">
          <div className="text-gray-600 text-lg">Error loading orders</div>
          <div className="text-gray-400 text-sm mt-2">
            {error?.data?.message || "Something went wrong"}
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">
            Order Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track all customer orders
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-soft border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-7 gap-4 px-6 py-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
              <div>Order ID</div>
              <div>Customer</div>
              <div>Total</div>
              <div>Date</div>
              <div>Payment</div>
              <div>Delivery</div>
              <div>Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="grid grid-cols-7 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
                  onClick={() => {
                    // Add navigation logic here
                    console.log("Navigate to order:", order._id);
                  }}
                >
                  {/* Order ID */}
                  <div className="font-mono text-sm text-gray-900">
                    #{order._id.slice(-8)}
                  </div>

                  {/* Customer */}
                  <div className="text-sm text-gray-900">
                    {order.user?.name || "Unknown Customer"}
                  </div>

                  {/* Total */}
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.totalPrice)}
                  </div>

                  {/* Date */}
                  <div className="text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </div>

                  {/* Payment Status */}
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.isPaid
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 border border-gray-300"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </div>

                  {/* Delivery Status */}
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.isDelivered
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 border border-gray-300"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Pending"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/order/${order._id}`);
                      }}
                      className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="text-gray-400 text-lg">No orders found</div>
                <div className="text-gray-300 text-sm mt-1">
                  Orders will appear here when customers place them
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        {orders && orders.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-soft border border-gray-200">
              <div className="text-2xl font-semibold text-gray-900">
                {orders.length}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft border border-gray-200">
              <div className="text-2xl font-semibold text-gray-900">
                {orders.filter((order) => order.isPaid).length}
              </div>
              <div className="text-sm text-gray-600">Paid Orders</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft border border-gray-200">
              <div className="text-2xl font-semibold text-gray-900">
                {orders.filter((order) => order.isDelivered).length}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft border border-gray-200">
              <div className="text-2xl font-semibold text-gray-900">
                {formatCurrency(
                  orders.reduce((sum, order) => sum + order.totalPrice, 0)
                )}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
