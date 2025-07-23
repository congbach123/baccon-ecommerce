import { useState, useRef, useEffect } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../pages/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../pages/slices/authSlice";
import {
  UserOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  DownOutlined,
  ShoppingOutlined,
  UnorderedListOutlined, // Added for Admin Orders icon
} from "@ant-design/icons";
import { toast } from "react-toastify";
import SearchBox from "./SearchBox";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get cart count and user info from Redux store
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      console.log("Logout successful");
    } catch (error) {
      toast.error(error);
      console.error("Logout failed:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Shop Name */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-white text-xl font-bold hover:text-gray-300 transition-colors duration-200">
                Baccon
              </h1>
            </Link>
          </div>

          {/* Search Box - Added here */}
          <div className="hidden md:block w-full max-w-md mx-4">
            <SearchBox />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/cart"
              className="text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md items-center gap-2 flex relative"
            >
              <div className="relative">
                <ShoppingCartOutlined />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem] shadow-soft">
                    {cartItems.length > 99 ? "99+" : cartItems.length}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </Link>

            {/* Profile Dropdown or Sign In */}
            {userInfo ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md items-center gap-2 flex focus:outline-none"
                >
                  <UserOutlined />
                  <span className="truncate max-w-24">
                    {userInfo.name || userInfo.email}
                  </span>
                  <DownOutlined
                    className={`text-xs transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-2 w-48 bg-coal border border-charcoal rounded-xl shadow-large transition-all duration-200 ease-out z-50 ${
                    isProfileDropdownOpen
                      ? "opacity-100 transform scale-100 translate-y-0"
                      : "opacity-0 transform scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-charcoal transition-colors duration-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <UserOutlined className="mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/myorders"
                      className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-charcoal transition-colors duration-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <ShoppingOutlined className="mr-2" />
                      My Orders
                    </Link>

                    {/* Admin Only Navigation */}
                    {userInfo.isAdmin && (
                      <>
                        {/* <div className="border-t border-charcoal my-1"></div> */}
                        <Link
                          to="/admin/orderlist"
                          className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-charcoal transition-colors duration-200"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <UnorderedListOutlined className="mr-2" />
                          Manage Orders
                        </Link>
                        <Link
                          to="/admin/productlist"
                          className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-charcoal transition-colors duration-200"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <UnorderedListOutlined className="mr-2" />
                          Manage Products
                        </Link>
                        <Link
                          to="/admin/userlist"
                          className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-charcoal transition-colors duration-200"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <UnorderedListOutlined className="mr-2" />
                          Manage Users
                        </Link>
                      </>
                    )}

                    <div className="border-t border-charcoal my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-charcoal transition-colors duration-200"
                    >
                      <LogoutOutlined className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md items-center gap-2 flex"
              >
                <UserOutlined />
                <span>Sign in</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white transition-colors duration-200"
              aria-label="Open menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                    isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                  }`}
                ></span>
                <span
                  className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                    isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          {/* Search Box - Added here */}
          <div className="hidden md:block w-full max-w-md mx-4">
            <SearchBox />
          </div>
          <nav className="py-4 space-y-2">
            <Link
              to="/cart"
              className="block w-full text-left text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md flex items-center gap-2"
            >
              <div className="relative">
                <ShoppingCartOutlined />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem] shadow-soft">
                    {cartItems.length > 99 ? "99+" : cartItems.length}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </Link>

            {/* Mobile Profile Section */}
            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  className="block w-full text-left text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md flex items-center gap-2"
                >
                  <UserOutlined />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/myorders"
                  className="block w-full text-left text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md flex items-center gap-2"
                >
                  <ShoppingOutlined />
                  <span>My Orders</span>
                </Link>

                {/* Admin Only Navigation - Mobile */}
                {userInfo.isAdmin && (
                  <Link
                    to="/orderlist"
                    className="block w-full text-left text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md flex items-center gap-2 border-l-2 border-accent-500 bg-gray-900/20"
                  >
                    <UnorderedListOutlined />
                    <span>Manage Orders</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md flex items-center gap-2"
                >
                  <LogoutOutlined />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block w-full text-left text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md flex items-center gap-2"
              >
                <UserOutlined />
                <span>Sign in</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
