import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} from "../slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);

  // Show feedback message temporarily
  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const cart = useSelector((state) => state.cart);
  const {
    cartItems,
    cartCount,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = cart;

  const updateQuantityHandler = (productId, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(productId));
      showFeedback("Item removed from cart");
    } else {
      dispatch(updateCartItemQuantity({ productId, quantity }));
      showFeedback(`Quantity updated to ${quantity}`);
    }
  };

  const removeFromCartHandler = (productId) => {
    dispatch(removeFromCart(productId));
    showFeedback("Item removed from cart");
  };

  const checkoutHandler = () => {
    // Navigate to checkout/login page
    navigate("/login?redirect=/shipping");
  };

  const continueShopping = () => {
    // Navigate back to products page
    navigate("/");
  };

  const clearCartHandler = () => {
    dispatch(clearCart());
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-display font-semibold text-coal mb-4">
                Your cart is empty
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <button
                onClick={continueShopping}
                className="bg-coal text-white px-8 py-3 rounded-xl font-medium hover:bg-charcoal transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-semibold text-coal mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-soft">
              {/* Clear Cart Button */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-coal">Items</h2>
                <button
                  onClick={clearCartHandler}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors duration-200"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="p-6 animate-fade-in">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-coal mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.product.brand}
                          {item.product.countInStock &&
                            item.product.countInStock <= 5 && (
                              <span className="ml-2 text-orange-600 font-medium">
                                Only {item.product.countInStock} left!
                              </span>
                            )}
                        </p>
                        <p className="text-xl font-semibold text-coal">
                          ${item.product.price}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantityHandler(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            className="p-2 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                            disabled={item.quantity <= 1}
                            title={
                              item.quantity <= 1
                                ? "Minimum quantity reached"
                                : "Decrease quantity"
                            }
                          >
                            <svg
                              className="w-4 h-4 text-gray-600 group-hover:scale-110 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <div className="px-4 py-2 bg-gray-50 border-x border-gray-300">
                            <span className="text-coal font-medium min-w-[2rem] text-center block animate-scale-in">
                              {item.quantity}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              updateQuantityHandler(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            className="p-2 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                            disabled={
                              item.quantity >= (item.product.countInStock || 99)
                            }
                            title={
                              item.quantity >= (item.product.countInStock || 99)
                                ? "Maximum stock reached"
                                : "Increase quantity"
                            }
                          >
                            <svg
                              className="w-4 h-4 text-gray-600 group-hover:scale-110 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => {
                            removeFromCartHandler(item.product._id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200 group"
                          title="Remove item"
                        >
                          <svg
                            className="w-5 h-5 group-hover:scale-110 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-[6rem]">
                        <p className="text-lg font-semibold text-coal animate-scale-in">
                          ${(item.quantity * item.product.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.product.price} each
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <button
                onClick={continueShopping}
                className="flex items-center text-gray-600 hover:text-coal transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-8 shadow-soft">
              <h2 className="text-xl font-semibold text-coal mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})
                  </span>
                  <span className="font-medium text-coal">${itemsPrice}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-coal">
                    {parseFloat(shippingPrice) === 0
                      ? "Free"
                      : `$${shippingPrice}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-coal">${taxPrice}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-coal">
                      Total
                    </span>
                    <span className="text-lg font-semibold text-coal">
                      ${totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              {parseFloat(itemsPrice) < 100 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    Add ${(100 - parseFloat(itemsPrice)).toFixed(2)} more for
                    free shipping!
                  </p>
                </div>
              )}

              <button
                onClick={checkoutHandler}
                className="w-full mt-6 bg-coal text-white py-3 px-6 rounded-xl font-medium hover:bg-charcoal transition-colors duration-200 animate-scale-in"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure checkout • SSL encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
