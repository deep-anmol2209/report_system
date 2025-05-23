import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch plazas with token
export const fetchPlazas = createAsyncThunk("plaza/fetchPlazas", async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // Get token from auth state
      const response = await axios.get("https://mepl-erp.co.in/superadmin/get-allplaza", {
        headers: { Authorization: `Bearer ${token}` }, // Attach token in headers
      });
      console.log('plazas:"',response);
      
      return response.data;
    } catch (error) {
      console.log(error);
      
      return rejectWithValue(error.response?.data?.message || "Failed to fetch plazas");
    }
  });


  export const fetchPlazasByProjectId = createAsyncThunk("plaza/fetchPlazasByProjectId", async (projectId, { getState, rejectWithValue }) => {
    try {
      console.log("hello from function");
      
      const token = getState().auth.token; // Get token from auth state
      const response = await axios.get(`https://mepl-erp.co.in/superadmin/get-plazasByProject/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }, // Attach token in headers
      });
      console.log('plazas:"',response.data);
      
      return response.data;
    } catch (error) {
      console.log(error);
      
      return rejectWithValue(error.response?.data?.message || "Failed to fetch plazas by id");
    }
  });




// Fetch plaza names by IDs
export const getPlazaNamesByIds = createAsyncThunk("admin/getPlazaNames", async (plazaIds, { rejectWithValue, getState }) => {
  try {
    const token = await getState().auth.token;
    console.log(plazaIds);
    // Ensure it's an actual array
    const formattedPlazaIds = Array.isArray(plazaIds) ? [...plazaIds] : [];
    
    const response = await axios.post("https://mepl-erp.co.in/superadmin/get-plazaNames", {plazaIds: formattedPlazaIds}  , {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    
    return response.data.plazas; // Assuming the API returns { "plazas": [{ _id, name }, ...] }
  } catch (err) {
    console.log(err);
    
    return rejectWithValue(err.response?.data || "Failed to fetch plaza names");
  }
});
  export const addPlaza= createAsyncThunk("plaza/addPlaza", async (payload, {rejectWithValue,getState})=>{
    try{
    const token = getState().auth.token; // Get token from auth state
    const response= await axios.post("https://mepl-erp.co.in/superadmin/add-plaza", payload,{
      headers: { Authorization: `Bearer ${token}` }, // Attach token in headers
    })

    console.log(response);
    return response.data
    
  }
    catch(err){
      console.log(err);
      
      return rejectWithValue(err.response?.data?.message)
    }
  })

export const deletePlaza = createAsyncThunk("plaza/deletePlaza", async (id) => {
  await axios.delete(`https://mepl-erp.co.in/superadmin/delete-plaza/${id}`);
  return id;
});

export const updatePlaza = createAsyncThunk("plaza/updatePlaza", async ({ id, updatedData }) => {
  const response = await axios.put(`https://mepl-erp.co.in/superadmin/update-plaza/${id}`, updatedData);
  return response.data;
});

const plazaSlice = createSlice({
  name: "plaza",
  initialState: {
    plazas: [],
    plazaNames: {}, // Store plaza names mapped by ID
    status: "idle",
    error: null,
  },
  reducers: {
    resetPlazaState: (state) => {
      state.plazas = [];
      state.status = "idle";
      state.error = null;
    },
    clearError: (state) => {
      state.error = null; // Reset the error state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlazas.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlazas.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plazas = action.payload ||[];
        console.log("Updated Plaza State:", state.plazas); // Debugging
      })
      .addCase(fetchPlazas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deletePlaza.fulfilled, (state, action) => {
        state.plazas = state.plazas.filter((plaza) => plaza._id !== action.payload);
      })
      .addCase(updatePlaza.fulfilled, (state, action) => {
        const index = state.plazas.findIndex((plaza) => plaza._id === action.payload._id);
        if (index !== -1) {
          state.plazas[index] = action.payload;
        }
      }).addCase(addPlaza.fulfilled, (state, action) => {
        state.status = "succeeded"; // Ensure status updates
        state.plazas.push(action.payload);
        state.error= null; // Directly push to array
      })
      .addCase(addPlaza.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Store error message
      })
        // Handle getPlazaNamesByIds
        .addCase(getPlazaNamesByIds.pending, (state) => {
          state.status = "loading";
        })
        .addCase(getPlazaNamesByIds.fulfilled, (state, action) => {
          state.status = "succeeded";
        
          // action.payload itself is the array of plazas, no need for `.plazas`
          if (Array.isArray(action.payload)) {
            action.payload.forEach((plaza) => {
              state.plazaNames[plaza._id] = plaza.plazaName;
            });
          } else {
            console.error("Unexpected payload format:", action.payload);
          }
          
          console.log(state.plazaNames);
        })
        .addCase(getPlazaNamesByIds.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload || "Failed to fetch plaza names";
        }).addCase(fetchPlazasByProjectId.pending,(state)=>{state.status= "loading"})
        .addCase(fetchPlazasByProjectId.fulfilled, (state, action)=>{
          state.status= "succeeded"

          if (Array.isArray(action.payload)) {
           console.log(action.payload);
           
          } else {
            console.error("Unexpected payload format:", action.payload);
          }
        })
        .addCase(fetchPlazasByProjectId.rejected,(state, action)=>{
          state.status= "failed";
          state.error= action.payload || "failed to fetch plaza names by id"
        })
  },
});

export const { resetPlazaState, clearError } = plazaSlice.actions;
export default plazaSlice.reducer;

