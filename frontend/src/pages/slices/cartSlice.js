import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../utils/cartUtils.js";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : {
      cartItems: [], // array to hold cart items
      cartCount: 0, // total number of items in the cart
      itemsPrice: 0, // subtotal of all items
      shippingPrice: 0, // shipping cost
      taxPrice: 0, // tax amount
      totalPrice: 0, // final total price
      shippingAddress: {},
      paymentMethod: "Paypal", // default payment method
    };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Remove unnecessary fields and use flat structure
      const { user, rating, numReviews, reviews, ...item } = action.payload;

      // Find existing item by _id (flat structure, not nested)
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // Update existing item
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        // Add new item
        state.cartItems = [...state.cartItems, item];
      }

      // Use utility function for all calculations
      return updateCart(state);
    },

    removeFromCart: (state, action) => {
      // Remove item by _id (flat structure)
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

      // Use utility function for all calculations
      return updateCart(state);
    },

    updateCartItemQuantity: (state, action) => {
      const { productId, qty } = action.payload; // Use qty consistently
      const item = state.cartItems.find((x) => x._id === productId);

      if (item) {
        item.qty = qty; // Use qty instead of quantity

        // Use utility function for all calculations
        return updateCart(state);
      }
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },

    clearCart: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },

    // Reset entire cart state (useful for logout)
    resetCart: (state) => {
      return initialState;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
