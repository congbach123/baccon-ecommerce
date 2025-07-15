import React, { useState } from "react";
import {
  CreditCard,
  Truck,
  MapPin,
  User,
  ShoppingBag,
  Lock,
  Check,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
} from "./slices/cartSlice"; // Update the import path
import { useCreateOrderMutation } from "./slices/orderSlice"; // Update the import path

const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user data from Redux
  const user = useSelector((state) => state.auth.userInfo);

  // Get cart data from Redux slice
  const cart = useSelector((state) => state.cart);
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    shippingAddress,
    paymentMethod,
  } = cart;

  // Order creation mutation
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();

  // Local state for form management
  const [selectedPayment, setSelectedPayment] = useState(
    paymentMethod || "card"
  );
  const [shippingMethod, setShippingMethod] = useState("standard");

  // Shipping address form state
  const [addressForm, setAddressForm] = useState({
    address: shippingAddress?.address || "",
    city: shippingAddress?.city || "",
    postalCode: shippingAddress?.postalCode || "",
    country: shippingAddress?.country || "",
  });

  // Debug logs with correct flat structure
  console.log("Cart data:", cart);
  console.log("Debug cart items:", cartItems);
  console.log(
    "Debug individual items:",
    cartItems?.map((item, index) => ({
      index,
      item,
      productId: item._id, // Changed: item.product._id -> item._id
      productName: item.name, // Changed: item.product.name -> item.name
      qty: item.qty, // Changed: item.quantity -> item.qty
    }))
  );

  // Handle shipping address changes
  const handleAddressChange = (field, value) => {
    const updatedAddress = { ...addressForm, [field]: value };
    setAddressForm(updatedAddress);

    // Auto-save to Redux when user finishes typing (you could also add a save button)
    dispatch(saveShippingAddress(updatedAddress));
  };

  // Handle payment method changes
  const handlePaymentChange = (method) => {
    setSelectedPayment(method);
    dispatch(savePaymentMethod(method));
  };

  const handlePlaceOrder = async () => {
    try {
      // Validate that shipping address is complete
      if (
        !addressForm.address ||
        !addressForm.city ||
        !addressForm.postalCode ||
        !addressForm.country
      ) {
        toast.error("Please complete your shipping address");
        return;
      }

      // Validate cart has items
      if (!cartItems || cartItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      // Debug cart items structure
      console.log("Cart items structure:", cartItems);

      // Ensure shipping and payment info is saved
      dispatch(saveShippingAddress(addressForm));
      dispatch(savePaymentMethod(selectedPayment));

      // Prepare order data - cartItems already have flat structure
      const orderData = {
        orderItems: cartItems,
        shippingAddress: addressForm,
        paymentMethod: selectedPayment,
        itemsPrice: parseFloat(itemsPrice),
        shippingPrice: parseFloat(shippingPrice),
        taxPrice: parseFloat(taxPrice),
        totalPrice: parseFloat(totalPrice),
      };

      console.log("Order data being sent:", orderData);

      // Create the order
      const result = await createOrder(orderData).unwrap();

      // Success handling
      toast.success("Order placed successfully!");

      // Clear the cart
      dispatch(clearCart());

      // Redirect to order details or order history
      navigate(`/order/${result._id}`); // Assuming you have an order details page
    } catch (error) {
      console.error("Order creation error:", error);

      // Handle specific error messages
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
            Complete Your Order
          </h1>
          <p className="text-gray-600">
            Review your order details and complete your purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Information */}
            <div className="bg-white rounded-2xl shadow-soft p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <User className="w-5 h-5 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Account Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="text-gray-900 font-medium">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="text-gray-900">{user?.phone}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-soft p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <MapPin className="w-5 h-5 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Shipping Address
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={addressForm.address}
                    onChange={(e) =>
                      handleAddressChange("address", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={addressForm.postalCode}
                    onChange={(e) =>
                      handleAddressChange("postalCode", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) =>
                      handleAddressChange("country", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
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
                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={selectedPayment === "card"}
                    onChange={(e) => handlePaymentChange(e.target.value)}
                    className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                  />
                  <CreditCard className="w-5 h-5 text-gray-600 ml-4" />
                  <span className="ml-3 font-medium text-gray-900">
                    Credit/Debit Card
                  </span>
                </label>

                {selectedPayment === "card" && (
                  <div className="ml-8 space-y-4 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          placeholder="123"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                          placeholder="John Smith"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={selectedPayment === "stripe"}
                    onChange={(e) => handlePaymentChange(e.target.value)}
                    className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                  />
                  <div className="w-5 h-5 bg-blue-600 rounded ml-4 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <span className="ml-3 font-medium text-gray-900">Stripe</span>
                </label>

                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="apple"
                    checked={selectedPayment === "apple"}
                    onChange={(e) => handlePaymentChange(e.target.value)}
                    className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                  />
                  <div className="w-5 h-5 bg-black rounded ml-4 flex items-center justify-center">
                    <span className="text-white text-xs">🍎</span>
                  </div>
                  <span className="ml-3 font-medium text-gray-900">
                    Apple Pay
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
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

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={item.image || "/api/placeholder/80/80"}
                        alt={item.name || "Product"}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {item.name || "Unknown Product"}{" "}
                          {/* Changed: item.product?.name -> item.name */}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Qty: {item.qty}{" "}
                          {/* Changed: item.quantity -> item.qty */}
                        </p>
                      </div>
                      <span className="font-semibold text-gray-900">
                        ${((item.price || 0) * item.qty).toFixed(2)}{" "}
                        {/* Changed: item.product?.price -> item.price, item.quantity -> item.qty */}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                )}
              </div>

              {/* Order Totals */}
              {cartItems.length > 0 && (
                <>
                  <div className="border-t border-gray-200 pt-6 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${parseFloat(itemsPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>${parseFloat(shippingPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>${parseFloat(taxPrice).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>${parseFloat(totalPrice).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isCreatingOrder}
                    className="w-full mt-6 bg-gray-900 text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCreatingOrder ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Place Order
                      </>
                    )}
                  </button>

                  {/* Security Notice */}
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span>
                      Your payment information is secure and encrypted
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
