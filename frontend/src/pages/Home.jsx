import React from "react";
import Product from "../components/Product";
import products from "../products";

const Home = () => {
  return (
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
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
