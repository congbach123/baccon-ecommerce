import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../slices/productSlice";
import Loader from "../../components/Loader";

const ProductEdit = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    countInStock: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductByIdQuery(productId);

  const [updateProduct] = useUpdateProductMutation();

  // Populate form when product data is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        brand: product.brand || "",
        category: product.category || "",
        description: product.description || "",
        price: product.price || "",
        countInStock: product.countInStock || "",
      });
    }
  }, [product]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    // Length validations
    if (formData.name.length > 100)
      newErrors.name = "Product name must be less than 100 characters";
    if (formData.brand.length > 50)
      newErrors.brand = "Brand must be less than 50 characters";
    if (formData.category.length > 50)
      newErrors.category = "Category must be less than 50 characters";
    if (formData.description.length > 1000)
      newErrors.description = "Description must be less than 1000 characters";

    // Price validation
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        newErrors.price = "Price must be a valid positive number";
      }
    }

    // Stock validation
    if (!formData.countInStock && formData.countInStock !== 0) {
      newErrors.countInStock = "Stock count is required";
    } else {
      const stock = parseInt(formData.countInStock);
      if (isNaN(stock) || stock < 0) {
        newErrors.countInStock =
          "Stock count must be a valid non-negative number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const updatedProduct = {
        _id: productId,
        ...formData,
        price: parseFloat(formData.price),
        countInStock: parseInt(formData.countInStock),
      };

      await updateProduct(updatedProduct).unwrap();

      // Success feedback could be added here
      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error("Failed to update product:", error);
      // You could add toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(-1);
  };

  // Loading state
  if (isLoading) {
    return <Loader message="Loading product details..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-soft border border-gray-200 max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-coal mb-4">
              Error Loading Product
            </h2>
            <p className="text-gray-600 mb-6">
              {error?.data?.message || "Failed to load product details"}
            </p>
            <div className="space-y-3">
              <button
                onClick={refetch}
                className="w-full bg-coal text-white py-3 px-4 rounded-xl font-medium hover:bg-charcoal transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleCancel}
                className="w-full bg-gray-100 text-coal py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-coal mb-2">Edit Product</h1>
          <p className="text-gray-600">
            Update product information and details
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-coal mb-2"
              >
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  errors.name
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-200 bg-white focus:border-coal focus:ring-coal"
                } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Brand and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-coal mb-2"
                >
                  Brand *
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                    errors.brand
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200 bg-white focus:border-coal focus:ring-coal"
                  } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                  placeholder="Enter brand name"
                />
                {errors.brand && (
                  <p className="text-red-600 text-sm mt-1">{errors.brand}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-coal mb-2"
                >
                  Category *
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                    errors.category
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200 bg-white focus:border-coal focus:ring-coal"
                  } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                  placeholder="Enter category"
                />
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Price and Stock Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-coal mb-2"
                >
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                    errors.price
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200 bg-white focus:border-coal focus:ring-coal"
                  } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="countInStock"
                  className="block text-sm font-medium text-coal mb-2"
                >
                  Stock Count *
                </label>
                <input
                  type="number"
                  id="countInStock"
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                    errors.countInStock
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200 bg-white focus:border-coal focus:ring-coal"
                  } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                  placeholder="0"
                />
                {errors.countInStock && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.countInStock}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-coal mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border transition-colors resize-none ${
                  errors.description
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-200 bg-white focus:border-coal focus:ring-coal"
                } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Image Placeholder */}
            <div>
              <label className="block text-sm font-medium text-coal mb-2">
                Product Image
              </label>
              <div className="w-full px-4 py-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center">
                <div className="text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm">Later</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-coal text-white py-3 px-6 rounded-xl font-medium hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-100 text-coal py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
