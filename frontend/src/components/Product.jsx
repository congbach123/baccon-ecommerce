import React from "react";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  // Handle button clicks to prevent navigation when clicking buttons
  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="group cursor-pointer">
      {/* Product Card with Link */}
      <Link to={`/product/${product._id || product.id}`} className="block">
        <div className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
          {/* Product Image */}
          <div className="relative overflow-hidden bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Out of Stock Badge */}
            {product.countInStock === 0 && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </div>
            )}
            {/* In Stock Badge */}
            {product.countInStock > 0 && product.countInStock <= 5 && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Only {product.countInStock} left
              </div>
            )}
            {/* Wishlist Button */}
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
              onClick={handleButtonClick}
            >
              <svg
                className="w-5 h-5 text-charcoal"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Product Info */}
          <div className="p-6">
            {/* Brand & Category */}
            <div className="flex items-center justify-between mb-2">
              {product.brand && (
                <span className="text-sm text-gray-500 font-medium tracking-wide uppercase">
                  {product.brand}
                </span>
              )}
              {product.category && (
                <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                  {product.category}
                </span>
              )}
            </div>

            {/* Product Name */}
            <h3 className="text-xl font-display font-semibold text-coal mt-2 mb-3 line-clamp-2">
              {product.name}
            </h3>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Price & Rating Row */}
            <div className="flex items-center justify-between mb-4">
              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-coal">
                  ${product.price}
                </span>
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-charcoal"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">
                    ({product.numReviews})
                  </span>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {product.countInStock > 0 ? (
                <span className="text-sm text-green-600 font-medium">
                  ✓ In Stock ({product.countInStock} available)
                </span>
              ) : (
                <span className="text-sm text-red-600 font-medium">
                  ✗ Out of Stock
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              className={`w-full font-medium py-3 px-6 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                product.countInStock > 0
                  ? "bg-coal hover:bg-charcoal text-white focus:ring-charcoal"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={product.countInStock === 0}
              onClick={handleButtonClick}
            >
              {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Product;
