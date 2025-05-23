import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserAttendance, resetAttendanceState } from '../../features/attendenceSlice';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttendanceHistory = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { attendance, loading, error } = useSelector((state) => state.attendance);

  useEffect(() => {
    if (user) {
      dispatch(getUserAttendance(user));
    }

    return () => {
      dispatch(resetAttendanceState());
    };
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w bg-gradient-to-br from-blue-100 to-purple-100 py-10 px-2 flex justify-center items-start">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-6 md:p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📅 Your Attendance History</h2>

        {attendance.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No attendance records found.</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-left text-sm uppercase">
                  <th className="px-4 py-3 sm:px-1 sm:py-2 whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 sm:px-2 sm:py-2 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 sm:px-2 sm:py-2 whitespace-nowrap">Marked By</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record._id} className="border-b hover:bg-gray-100 transition">
                    <td className="px-4 py-4 sm:px-2 sm:py-2 whitespace-nowrap">{format(new Date(record.date), 'MMM dd, yyyy')}</td>
                    <td className="px-4 py-4 sm:px-2 sm:py-2 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          record.status === 'present'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 sm:px-2 sm:py-2 whitespace-nowrap">{record.markedBy || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar pauseOnHover />
    </div>
  );
};

export default AttendanceHistory;
