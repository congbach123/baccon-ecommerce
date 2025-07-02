import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../slices/userSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res })); // Fixed syntax error
      toast.success("Login successful! Welcome back.");
      navigate(redirect);
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      console.log(errorMessage);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page with redirect
    const forgotPasswordPath =
      redirect && redirect !== "/"
        ? `/forgot-password?redirect=${encodeURIComponent(redirect)}`
        : "/forgot-password";
    navigate(forgotPasswordPath);
  };

  const handleSignUpRedirect = () => {
    // Navigate to register page with redirect as mentioned in comment
    const registerPath =
      redirect && redirect !== "/"
        ? `/register?redirect=${encodeURIComponent(redirect)}`
        : "/register";
    navigate(registerPath);
  };

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-coal tracking-tight mb-4">
            Welcome Back
          </h1>
          <p className="text-gray-600 font-sans">
            Sign in to your account to continue
          </p>
          <div className="w-16 h-1 bg-charcoal mx-auto mt-6"></div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <form onSubmit={submitHandler} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-sans font-semibold text-coal mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl font-sans text-coal placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-sans font-semibold text-coal mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl font-sans text-coal placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-coal transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  disabled={isLoading}
                  className="h-4 w-4 text-coal focus:ring-charcoal border-gray-300 rounded disabled:cursor-not-allowed"
                />
                <span className="ml-2 text-sm font-sans text-gray-600">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="text-sm font-sans text-coal hover:text-charcoal transition-colors duration-200 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-coal hover:bg-charcoal disabled:bg-gray-400 text-white font-sans font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Loading Overlay
          {isLoading && <Loader />} */}

          {/* Sign Up Link */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm font-sans text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={handleSignUpRedirect}
                disabled={isLoading}
                className="text-coal hover:text-charcoal font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-8">
          <p className="text-xs font-sans text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
