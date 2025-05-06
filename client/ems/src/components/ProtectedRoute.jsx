import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken, logout } from "../features/authSlice";

// Helper function to check if the token is expiring soon
const isTokenExpiringSoon = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    const expiryTime = exp * 1000;
    const currentTime = Date.now();
    return expiryTime - currentTime < 60000; // Less than 60 seconds left
  } catch (error) {
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

    const refreshToken = async () => {
      if (isTokenExpiringSoon(token)) {
        try {
          await dispatch(refreshAccessToken()).unwrap();
        } catch {
          dispatch(logout());
        }
      }
    };

    // Set an interval to check the token expiration every 60 seconds
    const interval = setInterval(refreshToken, 50000); // Check every 60s
    refreshToken(); // Run once on mount

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, [token, dispatch]);

  // Redirect to login if the user is not authenticated or token is missing/expired
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to unauthorized page if the user's role is not allowed
  if (roles && !roles.includes(role)) {
   if(role=== "project_incharge" && isEngineerAlso=== true){
    return children;
   }
    else{
    return <Navigate to="/unauthorized" replace />;
    }
  }

  else{

  if (roles && !roles.includes(role)) {
    console.log(role);
    
    return <Navigate to="/unauthorized" replace />;
  }
  }
  // If authenticated and role is allowed, render the children
  return children;
};

export default ProtectedRoute;