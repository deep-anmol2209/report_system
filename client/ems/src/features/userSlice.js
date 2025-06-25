import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://report-system-ts1c.onrender.com/api/superadmin/allusers';

// Async Thunks

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin or same user)
export const getUser = createAsyncThunk(
  'users/getUser',
  async (userId, { getState, rejectWithValue }) => {
    try {
        const token = await getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_URL}/${userId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Error fetching user'
      );
    }
  }
);

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
export const getUsers = createAsyncThunk(
  'users/getUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
        const token = await getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(API_URL, config);
      return response.data.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Error fetching users'
      );
    }
  }
);

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin or same user)
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ( payload , { getState, rejectWithValue }) => {
    try {
      console.log("in update");
      
        const token = await getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
   console.log(payload);
   
      const response = await axios.put(`https://report-system-ts1c.onrender.com/api/superadmin/update-user/${payload.id}`, payload.updatedData, config);
      console.log(response);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Error updating user'
      );
    }
  }
);

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { getState, rejectWithValue }) => {
    try {
        const token = await getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(`https://report-system-ts1c.onrender.com/api/superadmin/delete-user/${userId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Error deleting user'
      );
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    user: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetUserState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearUsers: (state) => {
      state.users = [];
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
        // Update in users array if it exists there
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.users = state.users.filter((user) => user._id !== action.payload._id);
        if (state.user?._id === action.payload._id) {
          state.user = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserState, clearUsers, clearUser } = userSlice.actions;
export default userSlice.reducer;
