import store from "../app/store";
import axios from "axios";
import { refreshAccessToken, logout } from "../features/authSlice";


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL_DEVELOPMENT, // Replace with your backend URL
    withCredentials: true,
  });

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await store.dispatch(refreshAccessToken()).unwrap();

        if (!newToken) throw new Error("Invalid token received");

        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        if (refreshError.response?.status === 401) {
          store.dispatch(logout());
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;