import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Product", "User", "Order"],
  endpoints: (builder) => ({
    // getProducts: builder.query({
    //   query: () => "/api/products",
    // }),
    // getProductById: builder.query({
    //   query: (id) => `/api/products/${id}`,
    // }),
  }),
});

// export const { useGetProductsQuery, useGetProductByIdQuery } = apiSlice;
