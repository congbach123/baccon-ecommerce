import { PRODUCT_URL } from "../../constants";
import { apiSlice } from "./apiSlice";

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => PRODUCT_URL,
    }),
    keepUnusedDataFor: 5,
    getProductById: builder.query({
      query: (id) => `${PRODUCT_URL}/${id}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productSlice;
