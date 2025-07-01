import { createSlice } from "@reduxjs/toolkit";
import { addDecimals, updateCart } from "../utils/cartUtils.js";

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
      paymentMethod: "",
    };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find(
        (x) => x.product._id === item.product._id
      );

      if (existItem) {
        // Fix: Compare by product._id instead of product object reference
        state.cartItems = state.cartItems.map((x) =>
          x.product._id === existItem.product._id ? item : x
        );
      } else {
        state.cartItems.push(item);
      }

      // Recalculate everything inline
      state.cartCount = state.cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );

      return updateCart(state);
    },

    removeFromCart: (state, action) => {
      // Fix: Compare by product._id instead of entire product object
      state.cartItems = state.cartItems.filter(
        (x) => x.product._id !== action.payload
      );

      // Recalculate everything inline
      state.cartCount = state.cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );

      state.itemsPrice = addDecimals(
        state.cartItems.reduce(
          (total, item) => total + item.quantity * item.product.price,
          0
        )
      );

      state.shippingPrice = addDecimals(
        parseFloat(state.itemsPrice) > 100 ? 0 : 10
      );

      state.taxPrice = addDecimals(parseFloat(state.itemsPrice) * 0.08);

      state.totalPrice = addDecimals(
        parseFloat(state.itemsPrice) +
          parseFloat(state.shippingPrice) +
          parseFloat(state.taxPrice)
      );

      localStorage.setItem("cart", JSON.stringify(state));
    },

    updateCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find((x) => x.product._id === productId);

      if (item) {
        item.quantity = quantity;

        // Recalculate everything
        state.cartCount = state.cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );

        state.itemsPrice = addDecimals(
          state.cartItems.reduce(
            (total, item) => total + item.quantity * item.product.price,
            0
          )
        );

        state.shippingPrice = addDecimals(
          parseFloat(state.itemsPrice) > 100 ? 0 : 10
        );

        state.taxPrice = addDecimals(parseFloat(state.itemsPrice) * 0.08);

        state.totalPrice = addDecimals(
          parseFloat(state.itemsPrice) +
            parseFloat(state.shippingPrice) +
            parseFloat(state.taxPrice)
        );

        localStorage.setItem("cart", JSON.stringify(state));
      }
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.cartCount = 0;
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      localStorage.setItem("cart", JSON.stringify(state));
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
} = cartSlice.actions;

export default cartSlice.reducer;
