import React from "react";

const Loading = ({
  title = "Loading...",
  message = "Please wait while we prepare your content.",
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="text-center">
        {/* Spinner with Pulsing Animation */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-purple-500 rounded-full animate-ping"></div>
          <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
        </div>

        {/* Loading Text */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-600">{message}</p>

        {/* Progress Bar with Smooth Fill Animation */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto mt-6">
          <div className="h-full bg-purple-500 animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;