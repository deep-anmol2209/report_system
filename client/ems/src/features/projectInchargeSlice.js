import { asyncThunkCreator, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { getallactiveAdmins } from "./adminSlice";


export const getallProjectIncharge = createAsyncThunk("admin/getAllProjectIncharge", async (_, {rejectWithValue, getState}) => {
    try{
        const token = getState().auth.token; // Get token from auth state
  const response = await axios.get("https://report-system-ts1c.onrender.com/api/superadmin/get-allprojectIncharge",{
    headers: { Authorization: `Bearer ${token}` }, // Attach token in headers
  });
  console.log(response);
  
  return response.data;
     }catch(err){console.log(err);
        return rejectWithValue(err.response?.data || "Failed to get Incharge");
     } // ✅ Must return data
  });

  export const addProjectIncharge = createAsyncThunk("admin/addProjectIncharge", async (payload, {rejectWithValue, getState}) => {
    try{
        const token= getState().auth.token
  const response = await axios.post("https://report-system-ts1c.onrender.com/api/superadmin/add-projectIncharge", payload,{
    headers: {Authorization: `Bearer ${token}`},
  });
  console.log(response);
  
  return response.data;
     }catch(err){console.log(err);
        return rejectWithValue(err.response?.data || "Failed to add Incharge");
     } // ✅ Must return data
  });

  export const changeRole = createAsyncThunk("admin/changeRole", async (payload, {rejectWithValue, getState}) => {
    try{
        const token= getState().auth.token
  const response = await axios.post("https://report-system-ts1c.onrender.com/api/superadmin/changeRole", payload,{
    headers: {Authorization: `Bearer ${token}`},
  });
  console.log(response);
  
  return response.data;
     }catch(err){console.log(err);
        return rejectWithValue(err.response?.data || "Failed to changeRole");
     } // ✅ Must return data
  });







  const projectInchargetSice = createSlice({
    name: "projectIncharge",
    initialState: {
      incharge: [],
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
        .addCase(getallProjectIncharge.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(getallProjectIncharge.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.incharge = action.payload || [];
        })
        .addCase(getallProjectIncharge.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload || "Failed to fetch project incharges";
        })
        .addCase(addProjectIncharge.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(addProjectIncharge.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.incharge.push(action.payload);
        })
        .addCase(addProjectIncharge.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload || "Failed to add project incharge";
        });
    },
  });
  
  export const { resetStatus } = projectInchargetSice.actions;
  export default projectInchargetSice.reducer;