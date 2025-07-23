import React from "react";
import { Link } from "react-router-dom";

const Pagination = ({ pages, page, isAdmin = false, keyword = "" }) => {
  // Don't render pagination if there's only one page
  if (pages <= 1) {
    return null;
  }

  // Generate the base URL depending on context (admin or regular user)
  const getPageUrl = (pageNumber) => {
    // For admin product list
    if (isAdmin) {
      return `/admin/productlist/page/${pageNumber}`;
    }

    // For regular home page with search
    if (keyword) {
      return `/search/${keyword}/page/${pageNumber}`;
    }

    // For regular home page without search
    return `/page/${pageNumber}`;
  };

  return (
    <div className="flex justify-center py-8">
      <div className="flex items-center space-x-2">
        {/* Previous Page Button */}
        {page > 1 && (
          <Link
            to={getPageUrl(page - 1)}
            className="border-2 border-gray-200 text-gray-600 hover:border-charcoal hover:text-coal transition-colors px-4 py-2 rounded-lg"
          >
            &laquo; Prev
          </Link>
        )}

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {[...Array(pages).keys()].map((x) => (
            <Link
              key={x + 1}
              to={getPageUrl(x + 1)}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                x + 1 === page
                  ? "bg-coal text-white font-medium"
                  : "border-2 border-gray-200 text-gray-600 hover:border-charcoal hover:text-coal"
              }`}
            >
              {x + 1}
            </Link>
          ))}
        </div>

        {/* Next Page Button */}
        {page < pages && (
          <Link
            to={getPageUrl(page + 1)}
            className="border-2 border-gray-200 text-gray-600 hover:border-charcoal hover:text-coal transition-colors px-4 py-2 rounded-lg"
          >
            Next &raquo;
          </Link>
        )}
      </div>
    </div>
  );
};

export default Pagination;
