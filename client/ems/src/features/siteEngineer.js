import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all site engineers
export const fetchSiteEngineers = createAsyncThunk(
  "siteEngineer/fetchSiteEngineers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // Get token from Redux store
      const response = await axios.get("https://mepl-erp.co.in/api/superadmin/get-allsiteengineers", {
        headers: { Authorization: `Bearer ${token}` }, // Attach token in headers
      });

      console.log("Site Engineers Data:", response.data); // Debugging
      return response.data;
    } catch (error) {
      console.log(error);
      
      return rejectWithValue(error.response?.data?.message || "Failed to fetch site engineers");
    }
  }
);



export const fetchActiveSiteEngineers = createAsyncThunk(
  "siteEngineer/fetchActiveSiteEngineers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // Get token from Redux store
      const response = await axios.get("https://mepl-erp.co.in/api/superadmin/get-activeEngineers", {
        headers: { Authorization: `Bearer ${token}` }, // Attach token in headers
      });

      console.log("Site Engineers Data:", response.data); // Debugging
      return response.data;
    } catch (error) {
      console.log(error);
      
      return rejectWithValue(error.response?.data?.message || "Failed to fetch active site engineers");
    }
  }
);



// Fetch plaza names by IDs
export const getEngineerNamesByIds = createAsyncThunk("admin/getPlazaNames", async (engineerIds, { rejectWithValue, getState }) => {
  try {
    const token = await getState().auth.token;
    console.log(engineerIds);
    // Ensure it's an actual array
    const formattedEngineerIds = Array.isArray(engineerIds) ? [...engineerIds] : [];
    
    const response = await axios.post("https://mepl-erp.co.in/api/superadmin/get-nameById", {engineerIds: formattedEngineerIds}  , {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    
    return response.data.engineers; // Assuming the API returns { "plazas": [{ _id, name }, ...] }
  } catch (err) {
    console.log(err);
    
    return rejectWithValue(err.response?.data || "Failed to fetch plaza names");
  }
});



export const addSiteEngineer = createAsyncThunk(
    "engineer/addEngineer",
    async (payload, { rejectWithValue, getState }) => {
      try {
        console.log("Adding engineer...");
  
        const token = getState().auth.token; // Ensure getState is included in parameters
        const response = await axios.post(
          "https://mepl-erp.co.in/api/superadmin/add-engineer",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        console.log(response.data);
        return response.data; // Return the added engineer's data
      } catch (error) {
        console.log(error);
        
        return rejectWithValue(error.response?.data?.message || "Failed to add site engineer");
      }
    }
  );

// Delete a site engineer
export const deleteSiteEngineer = createAsyncThunk(
  "siteEngineer/deleteSiteEngineer",
  async (username, { getState, rejectWithValue }) => {
    try {
      console.log(username);
      
      const token = getState().auth.token;
      await axios.delete(`https://mepl-erp.co.in/api/superadmin/delete-engineer/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return id; // Return the deleted engineer's ID
    } catch (error) {
      console.log(error);
      
      return rejectWithValue(error.response?.data?.message || "Failed to delete site engineer");
    }
  }
);

// Update a site engineer (Optional)
export const updateSiteEngineer = createAsyncThunk(
  "siteEngineer/updateSiteEngineer",
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(
        `https://mepl-erp.co.in/api/superadmin/update-siteengineer/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      console.log(error);
      
      return rejectWithValue(error.response?.data?.message || "Failed to update site engineer");
    }
  }
);



const siteEngineerSlice = createSlice({
  name: "siteEngineer",
  initialState: {
    engineers: [],
    engineerNames:{},
    status: "idle",
    error: null,
  },
  reducers: {
    resetSiteEngineerState: (state) => {
      state.engineers = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Engineers
      .addCase(fetchSiteEngineers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSiteEngineers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.engineers = action.payload;
      })
      .addCase(fetchSiteEngineers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete Engineer
      .addCase(deleteSiteEngineer.fulfilled, (state, action) => {
        state.engineers = state.engineers.filter((engineer) => engineer._id !== action.payload);
      })

      // Update Engineer
      .addCase(updateSiteEngineer.fulfilled, (state, action) => {
        const index = state.engineers.findIndex((engineer) => engineer._id === action.payload._id);
        if (index !== -1) {
          state.engineers[index] = action.payload;
        }
      })// Handle getPlazaNamesByIds
      .addCase(getEngineerNamesByIds.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getEngineerNamesByIds.fulfilled, (state, action) => {
        state.status = "succeeded";
    
        console.log("API Response:", action.payload); // Debugging
    
        const engineersArray = action.payload; // action.payload is already an array
    
        if (Array.isArray(engineersArray)) {
            engineersArray.forEach((engineer) => {
                state.engineerNames[engineer._id] = engineer.firstName;
            });
        } else {
            console.error("Unexpected payload format:", action.payload);
        }
    
        console.log("Processed engineer names:", state.engineerNames);
    })
      .addCase(getEngineerNamesByIds.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch plaza names";
      })
      .addCase(fetchActiveSiteEngineers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchActiveSiteEngineers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.engineers = action.payload.activeEngineers;
      })
      .addCase(fetchActiveSiteEngineers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetSiteEngineerState } = siteEngineerSlice.actions;
export default siteEngineerSlice.reducer;
