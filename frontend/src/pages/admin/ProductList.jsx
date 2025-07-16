import React from "react";
import { useGetProductsQuery } from "../slices/productSlice";

const ProductList = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  console.log(products);
  return <div>ProductList</div>;
};

export default ProductList;
