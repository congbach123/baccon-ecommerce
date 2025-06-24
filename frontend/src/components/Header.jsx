import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/cart"
              className="text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md items-center gap-2 flex"
            >
              <ShoppingCartOutlined />
              <span>Cart</span>
            </Link>
            <Link
              to="/login"
              className="text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md items-center gap-2 flex"
            >
              <UserOutlined />
              <span>Sign in</span>
            </Link>
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
            isMenuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <nav className="py-4 space-y-2">
            <Link
              to="/cart"
              className="block w-full text-left text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md"
            >
              Cart
            </Link>
            <Link
              to="/login"
              className="block w-full text-left text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
