import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../slices/productSlice";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const ProductEdit = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    countInStock: "",
    image: "", // Add image to form data
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductByIdQuery(productId);

  const [updateProduct] = useUpdateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();

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
        image: product.image || "",
      });

      // Set image preview if product has an image
      if (product.image) {
        setImagePreview(product.image);
      }
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

  // Handle file selection and upload
  const handleImageChange = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImagePreview(res.image);
      // Update formData with the new image path
      setFormData((prev) => ({
        ...prev,
        image: res.image,
      }));
    } catch (error) {
      toast.error(error?.data?.message || "Image upload failed");
    }
    // const file = e.target.files[0];

    // if (!file) return;

    // // Validate file type
    // const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    // if (!allowedTypes.includes(file.type)) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     image: "Please select a valid image file (JPEG, JPG, or PNG)",
    //   }));
    //   return;
    // }

    // // Validate file size (5MB limit)
    // const maxSize = 5 * 1024 * 1024; // 5MB
    // if (file.size > maxSize) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     image: "Image file size must be less than 5MB",
    //   }));
    //   return;
    // }

    // // Create preview
    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   setImagePreview(reader.result);
    // };
    // reader.readAsDataURL(file);

    // // Upload file
    // setIsUploading(true);
    // try {
    //   const uploadData = new FormData();
    //   uploadData.append("image", file);

    //   const response = await uploadProductImage(uploadData).unwrap();

    //   // Update form data with uploaded image path
    //   setFormData((prev) => ({
    //     ...prev,
    //     image: response.image,
    //   }));

    //   // Clear any previous image errors
    //   setErrors((prev) => ({
    //     ...prev,
    //     image: "",
    //   }));
    // } catch (error) {
    //   console.error("Upload failed:", error);
    //   setErrors((prev) => ({
    //     ...prev,
    //     image: "Failed to upload image. Please try again.",
    //   }));
    //   setImagePreview(null);
    // } finally {
    //   setIsUploading(false);
    // }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

      toast.success("Product updated successfully!");
      refetch(); // Refresh product data
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

            {/* Product Image Upload */}
            <div>
              <label className="block text-sm font-medium text-coal mb-2">
                Product Image
              </label>

              {/* Image Preview or Upload Area */}
              {imagePreview ? (
                <div className="relative">
                  <div className="w-full h-64 rounded-xl border border-gray-200 overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-coal px-3 py-2 rounded-lg text-sm font-medium shadow-soft border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-white text-red-600 px-3 py-2 rounded-lg text-sm font-medium shadow-soft border border-gray-200 hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <div className="text-gray-500">
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-coal rounded-full animate-spin mb-3"></div>
                        <p className="text-sm">Uploading image...</p>
                      </div>
                    ) : (
                      <>
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
                        <p className="text-sm font-medium mb-1">
                          Click to upload image
                        </p>
                        <p className="text-xs">PNG, JPG, JPEG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
                className="hidden"
                disabled={isUploading}
              />

              {errors.image && (
                <p className="text-red-600 text-sm mt-2">{errors.image}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="flex-1 bg-coal text-white py-3 px-6 rounded-xl font-medium hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting || isUploading}
                className="flex-1 bg-gray-100 text-coal py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
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
