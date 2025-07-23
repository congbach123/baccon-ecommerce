import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../pages/slices/productSlice";

const ProductCarousel = () => {
  const { data: topProducts, isLoading, error } = useGetTopProductsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    if (!topProducts) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === topProducts.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [topProducts]);

  const goToPrevious = () => {
    if (!topProducts) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? topProducts.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    if (!topProducts) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === topProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coal"></div>
      </div>
    );
  }

  if (error) {
    return null; // Don't show anything if there's an error
  }

  if (!topProducts || topProducts.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-2xl shadow-medium mb-16">
      {/* Carousel container */}
      <div
        className="h-full w-full transition-transform duration-500 ease-out flex"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {topProducts.map((product) => (
          <div key={product._id} className="min-w-full h-full relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
              <h2 className="font-display font-bold text-3xl mb-2">
                {product.name}
              </h2>
              <p className="text-gray-200 mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold mr-4">
                  ${product.price}
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 0)
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-300 ml-1">
                    ({product.numReviews || 0})
                  </span>
                </div>
              </div>
              <Link
                to={`/product/${product._id}`}
                className="inline-block bg-white text-coal px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full z-30 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full z-30 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* Indicator dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        {topProducts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              idx === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
