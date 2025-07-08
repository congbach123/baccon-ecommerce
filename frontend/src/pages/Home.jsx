import React from "react";
import { useEffect, useState } from "react";
import Product from "../components/Product";
import { useGetProductsQuery } from "./slices/productSlice";

const Home = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();

  return (
    <>
      {isLoading ? (
        // Loading state
        <div className="min-h-screen bg-off-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coal mx-auto mb-4"></div>
            <p className="text-gray-600 font-sans">Loading products...</p>
          </div>
        </div>
      ) : error ? (
        // Error state
        <div className="min-h-screen bg-off-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-display font-bold text-coal mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 font-sans">
              {error?.data?.message ||
                error?.message ||
                "Failed to load products"}
            </p>
          </div>
        </div>
      ) : (
        // Success state - Products display
        <div className="min-h-screen bg-off-white">
          {/* Container */}
          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-5xl font-display font-bold text-coal tracking-tight mb-4">
                Latest Products
              </h1>
              <div className="w-24 h-1 bg-charcoal"></div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products?.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
