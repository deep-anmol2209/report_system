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
};

// *Login Thunk*
export const loginUser = createAsyncThunk("api/auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("api/user/login", credentials);
    console.log(data);
    
    return data; // Return data directly; reducer will handle storage updates
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// *Refresh Token Thunk*
export const refreshAccessToken = createAsyncThunk("auth/refreshAccessToken", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(REFRESH_URL, {}, { withCredentials: true });

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
});

// *Auth Slice*
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.clear();
      return { ...initialState, isAuthenticated: false };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.role = payload.role;
        state.token = payload.token;
        state.isEngineerAlso= payload.isEngineerAlso
        state.isAuthenticated = true;
        state.error = null;

        // Save to localStorage
        localStorage.setItem("token", payload.token);
        localStorage.setItem("user", JSON.stringify(payload.user));
        localStorage.setItem("role", JSON.stringify(payload.role));
       payload.isEngineerAlso? localStorage.setItem("isEngineerAlso", JSON.stringify(payload.isEngineerAlso)): localStorage.setItem("isEngineerAlso", null)
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(refreshAccessToken.fulfilled, (state, { payload }) => {
        state.token = payload;
        state.isAuthenticated = true;

        // Save refreshed token
        localStorage.setItem("token", payload);
      })
      .addCase(refreshAccessToken.rejected, (state, { payload }) => {
        state.token = null;
        state.isAuthenticated = false;
        state.error = payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
