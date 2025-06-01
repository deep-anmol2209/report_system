import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../components/axiosInstance.js";
import { jwtDecode } from "jwt-decode";

const REFRESH_URL = "api/user/refresh-token";

// Check if the token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    return jwtDecode(token).exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Load auth data from localStorage
const storedToken = localStorage.getItem("token");

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  role: JSON.parse(localStorage.getItem("role")) || null,
  isEngineerAlso: JSON.parse(localStorage.getItem("isEngineerAlso")) || null,
  token: storedToken || null,
  isAuthenticated: storedToken ? !isTokenExpired(storedToken) : false,
  error: null,
  loading: true, // Added loading state
};

// *Login Thunk*
export const loginUser = createAsyncThunk(
  "api/auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("api/user/login", credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// *Refresh Token Thunk*
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        REFRESH_URL,
        {},
        { withCredentials: true }
      );

      if (!response.data || !response.data.accesstoken) {
        throw new Error("Invalid token response");
      }

      return response.data.accesstoken;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("Session expired, please log in again");
      }
      return rejectWithValue("Failed to refresh token");
    }
  }
);

// *Auth Slice*
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.clear();
      return {
        ...initialState,
        isAuthenticated: false,
        loading: false, // make sure loading is false on logout
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.role = payload.role;
        state.token = payload.token;
        state.isEngineerAlso = payload.isEngineerAlso;
        state.isAuthenticated = true;
        state.error = null;
        state.loading = false;

        // Save to localStorage
        localStorage.setItem("token", payload.token);
        localStorage.setItem("user", JSON.stringify(payload.user));
        localStorage.setItem("role", JSON.stringify(payload.role));
        if (payload.isEngineerAlso !== undefined && payload.isEngineerAlso !== null) {
          localStorage.setItem("isEngineerAlso", JSON.stringify(payload.isEngineerAlso));
        } else {
          localStorage.removeItem("isEngineerAlso");
        }
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.error = payload;
        state.loading = false;
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, { payload }) => {
        state.token = payload;
        state.isAuthenticated = true;
        state.loading = false;

        // Save refreshed token
        localStorage.setItem("token", payload);
      })
      .addCase(refreshAccessToken.rejected, (state, { payload }) => {
        state.token = null;
        state.isAuthenticated = false;
        state.error = payload;
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
