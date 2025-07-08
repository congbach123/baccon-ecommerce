import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./pages/slices/apiSlice";
import cartSliceReducer from "./pages/slices/cartSlice";
import authSliceReducer from "./pages/slices/authSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
