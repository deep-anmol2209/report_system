// src/features/countSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch counts
export const fetchCounts = createAsyncThunk(
  "counts/fetchCounts",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get("https://report-system-ts1c.onrender.com/api/superadmin/get-counts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      
      return response.data;
    } catch (err) {
      console.error("Fetch Counts Error:", err);
      return rejectWithValue(err.response?.data?.error || "Failed to fetch counts");
    }
  }
);

const countSlice = createSlice({
  name: "counts",
  initialState: {
    totalProjects: 0,
    totalPlazas: 0,
    totalSiteEngineers: 0,
    totalProjectIncharges: 0,
    totalPendingIssues: 0,
    status: "idle",
    error: null,
  },
  reducers: {
    resetCountStatus: (state) => {
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCounts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.totalProjects = action.payload.totalProjects;
        state.totalPlazas = action.payload.totalPlazas;
        state.totalSiteEngineers = action.payload.totalSiteEngineers;
        state.totalProjectIncharges = action.payload.totalProjectIncharges;
        state.totalPendingIssues = action.payload.totalPendingIssues;
      })
      .addCase(fetchCounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { resetCountStatus } = countSlice.actions;
export default countSlice.reducer;
