import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-700 text-white text-center p-6">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-10 max-w-lg">
        <FaLock className="text-red-500 text-6xl mb-4 animate-pulse" />
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-300 mb-6 text-lg">
          You do not have permission to view this page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 hover:bg-red-700 transition-all duration-300 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
