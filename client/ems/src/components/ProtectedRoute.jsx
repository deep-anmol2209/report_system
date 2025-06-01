import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken, logout } from "../features/authSlice";

// Check if token is expiring in the next 60 seconds
const isTokenExpiringSoon = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 - Date.now() < 60000;
  } catch {
    return true;
  }
};

const ProtectedRoute = ({ children, roles }) => {
  const dispatch = useDispatch();
  const { token, isAuthenticated, role, isEngineerAlso } = useSelector((state) => state.auth);

  // Token refresh logic
  useEffect(() => {
    if (!token) {
      dispatch(logout());
      return;
    }

    const refreshTokenIfNeeded = async () => {
      if (isTokenExpiringSoon(token)) {
        try {
          await dispatch(refreshAccessToken()).unwrap();
        } catch {
          dispatch(logout());
        }
      }
    };

    refreshTokenIfNeeded(); // run once on mount

    const interval = setInterval(refreshTokenIfNeeded, 50000); // every 50s
    return () => clearInterval(interval);
  }, [token, dispatch]);

  // Redirect if not authenticated or no token
  if (!isAuthenticated || !token) {
    console.log("redirected to login");
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  const isAuthorized = () => {
    if (!roles) return true; // if no roles defined, allow all authenticated users

    if (roles.includes(role)) return true;

    // Special case: project_incharge who is also engineer
    if (role === "project_incharge" && isEngineerAlso === true) return true;

    return false;
  };

  if (!isAuthorized()) {
    console.log("redirected to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
