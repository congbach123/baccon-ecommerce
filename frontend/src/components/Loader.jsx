import React from "react";

const Loader = ({
  message = "Loading...",
  fullScreen = true,
  showSpinner = true,
  className = "",
}) => {
  if (fullScreen) {
    return (
      <div
        className={`min-h-screen bg-off-white flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          {showSpinner && (
            <div className="w-12 h-12 border-3 border-gray-200 border-t-coal rounded-full animate-spin mx-auto mb-4"></div>
          )}
          <p className="text-coal font-medium text-lg">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="text-center">
        {showSpinner && (
          <div className="w-8 h-8 border-2 border-gray-200 border-t-coal rounded-full animate-spin mx-auto mb-3"></div>
        )}
        <p className="text-coal font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
