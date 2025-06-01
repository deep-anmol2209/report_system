import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { logout } from "../features/authSlice";

// Check if the token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const ProtectedRoute = ({ children, roles }) => {
  const dispatch = useDispatch();
  const { token, isAuthenticated, role, isEngineerAlso } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      dispatch(logout());
    }
  }, [token, dispatch]);

  // Redirect if not authenticated or no token
  if (!isAuthenticated || !token || isTokenExpired(token)) {
    console.log("redirected to login");
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  const isAuthorized = () => {
    if (!roles) return true; // allow all authenticated users if roles not specified
    if (roles.includes(role)) return true;
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
