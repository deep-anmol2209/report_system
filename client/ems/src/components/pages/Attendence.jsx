import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  markAttendance,
  checkMarkedToday,
  getUserAttendance,
} from '../../features/attendenceSlice';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';

const Attendence = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { markedToday, loading, error, success } = useSelector(
    (state) => state.attendance
  );

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserAttendance(user._id)).then(() => {
        dispatch(checkMarkedToday());
      });
    }

    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, user]);

  useEffect(() => {
    if (error) toast.error(error);
    if (success) toast.success('Attendance marked successfully!');
  }, [error, success]);

  const handleMarkAttendance =async () => {
    
    const action = await dispatch(markAttendance());

  
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Mark Attendance
          </h3>
          <p className="text-sm text-gray-500">
            {format(currentDate, 'MMMM do, yyyy h:mm a')}
          </p>
        </div>

        {markedToday ? (
          <div className="bg-green-100 text-green-800 border border-green-300 rounded-lg p-4 text-center font-medium">
            🎉 You've already marked your attendance for today!
          </div>
        ) : (
          <button
            onClick={handleMarkAttendance}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Marking...' : 'Mark Present'}
          </button>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
    </div>
  );
};

export default Attendence;
