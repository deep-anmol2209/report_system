import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  getAllAttendance,
  updateAttendance,
  resetAttendanceState,
  adminMarkAttendance,
} from '../../../features/attendenceSlice';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { getUsers } from '../../../features/userSlice';
import UserSelector from '../../UserSelector';

const AdminAttendanceManagement = () => {
  const token = localStorage.getItem('token')
  const apiUrl = "http://192.168.29.43:3000/api/attendence/generate-attendance"
  const dispatch = useDispatch();
  const { allAttendance, loading, error, success } = useSelector((state) => state.attendance);
  const { users } = useSelector((state) => state.users);

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [markStatus, setMarkStatus] = useState('present');
  const [showModal, setShowModal] = useState(false);
const [reportUser, setReportUser] = useState('');
const [reportStartDate, setReportStartDate] = useState('');
const [reportEndDate, setReportEndDate] = useState('');


  useEffect(() => {
    dispatch(getAllAttendance({ date: selectedDate, status: selectedStatus }));
    return () => {
      dispatch(resetAttendanceState());
    };
  }, [dispatch, selectedDate, selectedStatus]);

  useEffect(() => {
    dispatch(getUsers())
  }, [])
  useEffect(() => {
    if (error) toast.error(error);
    if (success) toast.success('Attendance updated successfully!');
  }, [error, success]);

  const handleStatusChange = (id, currentStatus) => {
    let newStatus;
  
    if (currentStatus === 'present') {
      newStatus = 'absent';
    } else if (currentStatus === 'absent') {
      newStatus = 'leave';
    } else {
      newStatus = 'present'; // If currentStatus is 'leave'
    }
  
    dispatch(updateAttendance({ id, status: newStatus }));
  };



  const handleGenerate = () => {
    const params = new URLSearchParams();
    if (reportUser) params.append('userId', reportUser);
    if (reportStartDate) params.append('startDate', reportStartDate);
    if (reportEndDate) params.append('endDate', reportEndDate);
  
    axios.get(`${apiUrl}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    })
      .then((response) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(response.data);
        link.download = 'attendance_report.pdf';
        link.click();
        setShowModal(false); // close modal after download
      })
      .catch((error) => {
        console.error('Error generating report:', error);
      });
  };
  

  const handleAdminMarkAttendance = () => {
    if (!selectedUser) return toast.error('Please select a user');
    dispatch(adminMarkAttendance({
      userId: selectedUser,
      date: selectedDate,
      status: markStatus,
    }));
  };

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Attendance Management</h2>

      <div><button  onClick={() => setShowModal(true)}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Generate Report</button></div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
          </select>
        </div>
      </div>

      {/* Mark Attendance */}
      <div className="bg-gray-50 p-4 rounded-lg border mb-6">
        <h3 className="text-lg font-semibold mb-4">Mark Attendance for User</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <UserSelector
            users={users}
            selectedUser={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          />
          <select
            value={markStatus}
            onChange={(e) => setMarkStatus(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">leave</option>
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdminMarkAttendance}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">User</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Marked By</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allAttendance.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">No attendance records found</td>
              </tr>
            ) : (
              allAttendance.map((record) => (
                <tr key={record._id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{format(new Date(record.date), 'MMM dd, yyyy')}</td>
                  <td className="px-4 py-2">{record.user?.firstName || 'N/A'}</td>
                  <td className="px-4 py-2">
                    <span
                     className={`inline-block px-2 py-1 text-sm font-semibold rounded-full ${
                      record.status === 'present'
                        ? 'bg-green-100 text-green-700'
                        : record.status === 'absent'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                    
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{record.markedBy}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleStatusChange(record._id, record.status)}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Generate Attendance Report</h3>

      {/* User Selector */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Select User</label>
        <UserSelector
          users={users}
          selectedUser={reportUser}
          onChange={(e) => setReportUser(e.target.value)}
        />
      </div>

      {/* Date Range */}
      <div className="mb-3">
        <label className="block mb-1 font-medium">Start Date</label>
        <input
          type="date"
          value={reportStartDate}
          onChange={(e) => setReportStartDate(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">End Date</label>
        <input
          type="date"
          value={reportEndDate}
          onChange={(e) => setReportEndDate(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download Report
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AdminAttendanceManagement;
