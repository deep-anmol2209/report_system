import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


// Fetch all admins from API
export const getallAdmins = createAsyncThunk("admin/getAll", async (_, {rejectWithValue}) => {
  try{
const response = await axios.get("https://mepl-erp.co.in/superadmin/get-alladmins");
console.log(response);

return response.data.admins;
   }catch(er){console.log(err);
      return rejectWithValue(err.response?.data || "Failed to get admin");
   } // ✅ Must return data
});


export const getallactiveAdmins = createAsyncThunk("admin/getAllactive", async (_, {rejectWithValue}) => {
    try{
  const response = await axios.get("https://mepl-erp.co.in/superadmin/get-allActive-admin");
  console.log(response.data.admins);
  
  return response.data.admins;
     }catch(er){console.log(err);
        return rejectWithValue(err.response?.data || "Failed to get admin");
     } // ✅ Must return data
});

export const addnewAdmin= createAsyncThunk('add/Admin', async(adminData, {rejectWithValue})=>{
    try{
    const response= await axios.post('https://mepl-erp.co.in/superadmin/add-admin', adminData);
    console.log(response);
    return response.status
    }catch(err){
        return rejectWithValue(err.response?.data || "Failed to add admin");
    }
})

export const deleteAdmin= createAsyncThunk('remove/admin', async(username, {rejectWithValue})=>{
  try{
    console.log(username);
    
   const response= await axios.delete(`https://mepl-erp.co.in/superadmin/delete-admin/${username}`)
   console.log(response);
   if(response.status===200){return "ok"}
   else{return response.data.message}
  
   
  }catch(err){
    return rejectWithValue(err.response?.data || "failed to delete")
  }
})






const adminSlice = createSlice({
  name: "admins",
  initialState: { list: [], loading: false, error: null }, // ✅ Added loading & error state
  reducers: {
    setAdmins: (state, action) => {
      state.list = action.payload;
    },
    addAdmin: (state, action) => {
      state.list.push(action.payload);
    },
    removeAdmin: (state, action) => {
      state.list = state.list.filter((admin) => admin.id !== action.payload); // ✅ Assign filtered list back
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getallactiveAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getallactiveAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || []; // ✅ Replace entire list instead of pushing
      })
      .addCase(getallactiveAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addnewAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addnewAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload); // ✅ Add the new admin to the list
      })
      .addCase(addnewAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
  })
  .addCase(getallAdmins.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getallAdmins.fulfilled, (state, action) => {
    state.loading = false;
    state.list = action.payload || []; // ✅ Replace entire list instead of pushing
  })
  .addCase(getallAdmins.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message;
  })

  // ✅ Handle Delete Admin
  .addCase(deleteAdmin.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(deleteAdmin.fulfilled, (state, action) => {
    console.log(action.payload);

    state.loading = false;
    
    // Ensure we're accessing the correct object inside payload
    if (action.payload && action.payload.deletedAdmin) {
        state.list = state.list.filter(
            (admin) => admin.username !== action.payload.deletedAdmin.username
        );
    }
})
  .addCase(deleteAdmin.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });
}});

export const { setAdmins, addAdmin, removeAdmin } = adminSlice.actions;
export default adminSlice.reducer;
