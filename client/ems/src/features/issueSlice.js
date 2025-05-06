import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Project from "../../../../server/model/projectModel";

// Async thunk to add an issue
export const addIssue = createAsyncThunk("plaza/addIssue", async (payload, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    const response = await axios.post("https://mepl-erp.co.in/api/superadmin/add-issue", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.log(err);

    return rejectWithValue(err.response?.data?.message || "Error adding issue");
  }
});

// Async thunk to get all issues
export const getAllPendingIssues = createAsyncThunk("plaza/getAllPendingIssues", async (_, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    const response = await axios.get("https://mepl-erp.co.in/api/superadmin/get-allPendingIssues", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("API Response:", response.data);
    return response.data.issues;
  } catch (err) {
    console.log(err);

    return rejectWithValue(err.response?.data?.msg || "Error fetching issues");
  }
});

export const getIssuesByPlazaId = createAsyncThunk("plaza/getIssuesByPlazaId", async (_, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    const response = await axios.get("https://mepl-erp.co.in/api/superadmin/get-issuesByPlazaId", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("API Response:", response.data);
    return response.data.issues;
  } catch (err) {
    console.log(err);

    return rejectWithValue(err.response?.data?.msg || "Error fetching issues");
  }

})

export const getAllIssues = createAsyncThunk("plaza/getAllIssues", async (_, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;
    const response = await axios.get("https://mepl-erp.co.in/api/superadmin/get-allIssues", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("API Response:", response.data);
    return response.data.issues;
  } catch (err) {
    console.log(err);

    return rejectWithValue(err.response?.data?.msg || "Error fetching issues");
  }
});

export const resolveIssue = createAsyncThunk(
  "issues/resolveIssue",
  async ({ issueId, remarks }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post("https://mepl-erp.co.in/api/superadmin/resolve-issue", {
        issueId,
        remarks,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);

      return response.data; // Return updated issue
    } catch (error) {
      console.log(error);

      return rejectWithValue(error.response.data);
    }
  }
);


export const getPendingIssuesById = createAsyncThunk(
  "issues/getIssuesById",
  async (_, { rejectWithValue, getState }) => {
    console.log("helllo from issues by id");

    try {
      const token = getState().auth.token;
      const response = await axios.get("https://mepl-erp.co.in/api/superadmin/get-allPendingIssuesById", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);

      return response.data.issues; // Return updated issue
    } catch (error) {
      console.log(error);

      return rejectWithValue(error.response.data);
    }
  }

);

export const getIssuesByProjectId = createAsyncThunk("issues/getIssuesByProjectId",
  async (projectId, { rejectWithValue, getState }) => {

    try {
      const token = getState().auth.token;
      const response = await axios.get(`https://mepl-erp.co.in/api/superadmin/get-projectIssues/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);

      return response.data.issues; // Return updated issue
    } catch (error) {
      console.log(error);

      return rejectWithValue(error.response.data);
    }

  }
)



// Issue slice
const issueSlice = createSlice({
  name: "issue",
  initialState: {
    allIssues: [],
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
      .addCase(addIssue.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addIssue.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allIssues.push(action.payload); // Fixed here
      })
      .addCase(addIssue.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllPendingIssues.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllPendingIssues.fulfilled, (state, action) => {
        console.log("Redux Store Updated:", action.payload);
        state.status = "succeeded";
        state.allIssues = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllPendingIssues.rejected, (state, action) => {
        console.log(action.payload);

        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllIssues.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllIssues.fulfilled, (state, action) => {
        console.log("Redux Store Updated:", action.payload);
        state.status = "succeeded";
        state.allIssues = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllIssues.rejected, (state, action) => {
        console.log(action.payload);

        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(resolveIssue.fulfilled, (state, action) => {
        state.allIssues = state.allIssues.filter((issue) => issue.issueId !== action.payload.issue.issueId);
      })
      .addCase(resolveIssue.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getPendingIssuesById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPendingIssuesById.fulfilled, (state, action) => {
        console.log("function fulfilled");

        state.status = "succeeded";
        state.allIssues = Array.isArray(action.payload) ? action.payload : []; // Ensure it's always an array
      })
      .addCase(getPendingIssuesById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
      })
      .addCase(getIssuesByProjectId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getIssuesByProjectId.fulfilled, (state, action) => {
        console.log("function fulfilled");

        state.status = "succeeded";
        state.allIssues = Array.isArray(action.payload) ? action.payload : []; // Ensure it's always an array
      })
      .addCase(getIssuesByProjectId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
      }).addCase(getIssuesByPlazaId.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.allIssues = Array.isArray(action.payload) ? action.payload : [];
      }).addCase(getIssuesByPlazaId.pending, (state) => {
        state.status = "loading"
      }).addCase(getIssuesByPlazaId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
      })
  },
});

export const { resetStatus } = issueSlice.actions;
export default issueSlice.reducer;
