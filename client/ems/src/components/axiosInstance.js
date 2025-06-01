import axios from "axios";
import store from "../app/store";
import { logout } from "../features/authSlice";
import { jwtDecode } from "jwt-decode";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL_DEVELOPMENT,
  withCredentials: true,
});

// Attach Authorization token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired token response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const state = store.getState();
      const token = state.auth.token;

      // Check if token is expired (fallback logic)
      let isExpired = true;
      try {
        const { exp } = jwtDecode(token);
        isExpired = exp * 1000 < Date.now();
      } catch {
        isExpired = true;
      }

      if (isExpired) {
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
