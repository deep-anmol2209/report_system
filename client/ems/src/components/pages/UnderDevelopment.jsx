import React from "react";

const UnderDevelopment = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">🚧 Page Under Development</h1>
        <p className="text-lg text-gray-600 mb-6">
          We're working hard to bring this page to life. Please check back later!
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-2 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default UnderDevelopment;
