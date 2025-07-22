import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../slices/userSlice";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const UserEdit = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    isAdmin: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: user, isLoading, error, refetch } = useGetUserByIdQuery(userId);

  const [updateUser] = useUpdateUserMutation();

  // Populate form when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        isAdmin: user.isAdmin || false,
      });
    }
  }, [user]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";

    // Length validations
    if (formData.name.length > 50)
      newErrors.name = "Name must be less than 50 characters";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      const updatedUser = {
        _id: userId,
        ...formData,
      };

      await updateUser(updatedUser).unwrap();

      toast.success("User updated successfully!");
      refetch(); // Refresh user data
      navigate("/admin/userlist"); // Navigate back to user list
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(error?.data?.message || "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/admin/userlist");
  };

  // Loading state
  if (isLoading) {
    return <Loader message="Loading user details..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-soft border border-gray-200 max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-coal mb-4">
              Error Loading User
            </h2>
            <p className="text-gray-600 mb-6">
              {error?.data?.message || "Failed to load user details"}
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
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-coal mb-2">Edit User</h1>
          <p className="text-gray-600">
            Update user information and permissions
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-coal mb-2"
              >
                Full Name *
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
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-coal mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  errors.email
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-200 bg-white focus:border-coal focus:ring-coal"
                } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Admin Status */}
            <div>
              <label className="block text-sm font-medium text-coal mb-3">
                User Permissions
              </label>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    name="isAdmin"
                    checked={formData.isAdmin}
                    onChange={handleChange}
                    className="w-4 h-4 text-coal bg-white border-gray-300 rounded focus:ring-coal focus:ring-2"
                  />
                  <label
                    htmlFor="isAdmin"
                    className="ml-3 text-sm font-medium text-coal"
                  >
                    Administrator
                  </label>
                </div>
                <p className="text-xs text-gray-600 mt-2 ml-7">
                  {formData.isAdmin
                    ? "This user has full administrative privileges"
                    : "This user has standard user privileges"}
                </p>
              </div>
            </div>

            {/* Current Role Display */}
            <div>
              <label className="block text-sm font-medium text-coal mb-2">
                Current Role
              </label>
              <div className="flex items-center">
                <span
                  className={`inline-flex px-4 py-2 rounded-xl text-sm font-medium ${
                    formData.isAdmin
                      ? "bg-coal text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {formData.isAdmin ? "Administrator" : "Standard User"}
                </span>
              </div>
            </div>

            {/* Warning for Admin Changes */}
            {formData.isAdmin && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="w-5 h-5 text-yellow-600 mt-0.5 mr-3">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 mb-1">
                      Administrator Access
                    </h4>
                    <p className="text-sm text-yellow-700">
                      This user will have full access to all administrative
                      features including user management, product management,
                      and order management.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-coal text-white py-3 px-6 rounded-xl font-medium hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update User"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
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

export default UserEdit;
