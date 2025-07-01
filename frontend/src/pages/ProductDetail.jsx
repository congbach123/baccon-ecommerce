import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductByIdQuery } from "../slices/productSlice";
import Loader from "../components/Loader"; // Adjust path as needed
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice"; // Adjust path as needed

const ProductDetail = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const { data: product, error, isLoading } = useGetProductByIdQuery(productId);

  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(
      addToCart({
        product: {
          _id: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          brand: product.brand,
          category: product.category,
          countInStock: product.countInStock,
        },
        // ...product,
        quantity: quantity,
      })
    );
    console.log(product);
    navigate("/cart");
  };

  // Loading State
  if (isLoading) {
    return <Loader message="Loading product details..." />;
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-display font-bold text-coal mb-4">
            Something went wrong
          </h1>

          <p className="text-gray-600 mb-2">
            {error?.data?.message ||
              error?.error ||
              "Failed to load product details"}
          </p>

          {error?.status && (
            <p className="text-gray-400 text-sm mb-6">
              Error Code: {error.status}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-coal text-white px-6 py-3 rounded-xl font-medium hover:bg-charcoal transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-medium hover:border-charcoal hover:text-coal transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Product Not Found State
  if (!product) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-display font-bold text-coal mb-4">
            Product Not Found
          </h1>

          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-coal text-white px-6 py-3 rounded-xl font-medium hover:bg-charcoal transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? "text-charcoal"
            : index < rating
            ? "text-gray-400"
            : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-off-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-coal transition-colors group mb-8"
        >
          <svg
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <div className="space-y-6">
            <div className="aspect-square bg-white rounded-3xl shadow-soft overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {product.brand}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-display font-bold text-coal leading-tight mb-6">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-gray-600 font-medium">
                  {product.rating}
                </span>
                <span className="text-gray-400">
                  ({product.numReviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <span className="text-4xl font-bold text-coal">
                  ${product.price}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-display font-semibold text-coal mb-4">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-coal">Availability:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.countInStock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.countInStock > 0
                    ? `${product.countInStock} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            {product.countInStock > 0 && (
              <div className="space-y-6">
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-semibold text-coal mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-charcoal transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>

                    <span className="text-xl font-semibold text-coal w-12 text-center">
                      {quantity}
                    </span>

                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(product.countInStock, quantity + 1)
                        )
                      }
                      className="w-12 h-12 border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-charcoal transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={addToCartHandler}
                  className="w-full bg-coal text-white py-4 rounded-2xl font-semibold text-lg hover:bg-charcoal transition-colors transform hover:scale-[0.98] active:scale-95"
                >
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>
              </div>
            )}

            {/* Out of Stock Message */}
            {product.countInStock === 0 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
                <svg
                  className="w-12 h-12 text-red-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Currently Out of Stock
                </h3>
                <p className="text-red-600">
                  This item is temporarily unavailable. Check back later.
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="font-semibold text-coal">Brand:</span>
                  <span className="text-gray-600 ml-2">{product.brand}</span>
                </div>
                <div>
                  <span className="font-semibold text-coal">Category:</span>
                  <span className="text-gray-600 ml-2">{product.category}</span>
                </div>
                <div>
                  <span className="font-semibold text-coal">Product ID:</span>
                  <span className="text-gray-600 ml-2">{product._id}</span>
                </div>
                <div>
                  <span className="font-semibold text-coal">Rating:</span>
                  <span className="text-gray-600 ml-2">
                    {product.rating}/5 ({product.numReviews} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
