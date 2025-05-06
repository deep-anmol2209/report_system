import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all projects
export const getallProjects = createAsyncThunk("admin/getAllProject", async (_, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    const response = await axios.get("https://mepl-erp.co.in/api/superadmin/get-allproject", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    
    return response.data;
  } catch (err) {
    console.log(err);
    
    return rejectWithValue(err.response?.data || "Failed to get projects");
  }
});

// Update Project (Fixed)
export const updateProject = createAsyncThunk("admin/updateProject", async ({ id, formData }, { rejectWithValue, getState }) => {
  try {
    console.log("hello");
    console.log(id);
    
    
    const token = getState().auth.token;
    const response = await axios.put(`https://mepl-erp.co.in/api/superadmin/update-project/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    
    return response.data;
  } catch (err) {
    console.log(err);
    
    return rejectWithValue(err.response?.data || "Failed to update project");
  }
});

// Get Projects by Incharge ID (Fixed)
export const getProjectByInchargeId = createAsyncThunk("incharge/getProjectsByIncharge", async (_, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    const response = await axios.get("https://mepl-erp.co.in/api/superadmin/get-projectsByInchargeId", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    
    return response.data.project;
  } catch (err) {
    console.log(err);
    
    return rejectWithValue(err.response?.data || "Failed to get projects");
  }
});

// Add a new project (Fixed)
export const addProject = createAsyncThunk("admin/addProject", async (payload, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    const response = await axios.post("https://mepl-erp.co.in/api/superadmin/add-project", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    
    return rejectWithValue(err.response?.data || "Failed to add project");
  }
});

// Project Slice
const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    status: "idle",
    error: null,
  },

  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(getallProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getallProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload || [];
      })
      .addCase(getallProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Find and update the project in the state
        const index = state.projects.findIndex((proj) => proj._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add Project (Fixed)
      .addCase(addProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects.push(action.payload);
      })
      .addCase(addProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Get projects by incharge ID (Fixed)
      .addCase(getProjectByInchargeId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getProjectByInchargeId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = action.payload; // Assigning instead of pushing
      })
      .addCase(getProjectByInchargeId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetStatus } = projectSlice.actions;
export default projectSlice.reducer;
