import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { format } from 'date-fns';

const API_URL = 'https://mepl-erp.co.in/api/attendence';

// Async Thunks
export const markAttendance = createAsyncThunk(
  'attendance/markAttendance',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`${API_URL}/mark`, {}, config);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Error marking attendance';
      return rejectWithValue(message);
    }
  }
);

export const getUserAttendance = createAsyncThunk(
  'attendance/getUserAttendance',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_URL}/user/${userId}`, config);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Error fetching attendance';
      return rejectWithValue(message);
    }
  }
);

export const getAllAttendance = createAsyncThunk(
  'attendance/getAllAttendance',
  async ({ date, status }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const params = {};
      if (date) params.date = format(new Date(date), 'yyyy-MM-dd');
      if (status) params.status = status;

      const response = await axios.get(`${API_URL}/all`, {
        headers: config.headers,
        params,
      });
console.log(response);

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Error fetching all attendance';
      return rejectWithValue(message);
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'attendance/updateAttendance',
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(`${API_URL}/${id}`, { status }, config);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Error updating attendance';
      return rejectWithValue(message);
    }
  }
);

export const adminMarkAttendance = createAsyncThunk(
  'attendance/adminMarkAttendance',
  async ({ userId, date, status }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${API_URL}/admin-mark`,
        { userId, date, status },
        config
      );

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Error marking attendance';
      return rejectWithValue(message);
    }
  }
);

// Slice
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    attendance: [],
    allAttendance: [],
    loading: false,
    error: null,
    success: false,
    markedToday: false,
  },
  reducers: {
    resetAttendanceState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    checkMarkedToday: (state) => {
      const today = new Date();
      state.markedToday = state.attendance.some(
        (record) =>
          format(new Date(record.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Mark Attendance
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.markedToday = true;

        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const alreadyExists = state.attendance.find(
          (att) => format(new Date(att.date), 'yyyy-MM-dd') === todayStr
        );

        if (!alreadyExists) {
          state.attendance.unshift(action.payload);
        }
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Attendance
      .addCase(getUserAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
        state.markedToday = action.payload.some(
          (record) =>
            format(new Date(record.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
        );
      })
      .addCase(getUserAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Attendance
      .addCase(getAllAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.allAttendance = action.payload;
      })
      .addCase(getAllAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Attendance
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.allAttendance = state.allAttendance.map((att) =>
          att._id === action.payload._id ? action.payload : att
        );
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin Mark Attendance
      .addCase(adminMarkAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminMarkAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const existingIndex = state.allAttendance.findIndex(
          (att) => att._id === action.payload._id
        );
        if (existingIndex >= 0) {
          state.allAttendance[existingIndex] = action.payload;
        } else {
          state.allAttendance.unshift(action.payload);
        }
      })
      .addCase(adminMarkAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAttendanceState, checkMarkedToday } = attendanceSlice.actions;
export default attendanceSlice.reducer;
