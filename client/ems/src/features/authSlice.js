import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../components/axiosInstance.js";
import { jwtDecode } from "jwt-decode";

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
  loading: false,
};

// *Login Thunk*
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("api/user/login", credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
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
        loading: false,
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
        state.loading = false;
        state.error = null;

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
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
