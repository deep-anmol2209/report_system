// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllAttendance, deleteAttendance, Upsert, fetchUserMonthlyAttendance } from '../../../features/attendenceSlice';
// import { fetchActiveSiteEngineers } from '../../../features/siteEngineer';

// const AdminAttendance = () => {
//   const dispatch = useDispatch();
//   const { engineers, status } = useSelector((state) => state.siteEngineer || { engineers: [] });
//   const { records, loading } = useSelector((state) => state.attendance || { records: [] });
  
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [userAttendance, setUserAttendance] = useState([]);

//   useEffect(() => {
//     // Fetch all site engineers
//     dispatch(fetchActiveSiteEngineers());
//     console.log("Fetching engineers");
//   }, [dispatch]);
  
//   // Debug log for userAttendance
//   useEffect(() => {
//     console.log("Current userAttendance:", userAttendance);
//     console.log("Type of userAttendance:", typeof userAttendance, Array.isArray(userAttendance));
//   }, [userAttendance]);

//   // Debug logs to trace data flow
//   useEffect(() => {
//     console.log("Engineers from state:", engineers);
//     console.log("Site engineer status:", status);
//   }, [engineers, status]);

//   // Function to handle viewing a user's attendance
//   const handleViewAttendance = (user) => {
//     console.log("Selected user for attendance:", user);
//     setSelectedUser(user);
//     setShowModal(true);
//     loadUserAttendance(user._id);
//   };

//   // Load user attendance for selected month and year
//   const loadUserAttendance = (userId) => {
//     console.log(`Loading attendance for user ${userId} for ${selectedMonth}/${selectedYear}`);
    
//     dispatch(fetchUserMonthlyAttendance({ 
//       userId, 
//       month: selectedMonth, 
//       year: selectedYear 
//     })).then((result) => {
//       console.log("Attendance result:", result);
//       if (!result.error) {
//         // Ensure we're always setting an array
//         const attendanceData = Array.isArray(result.payload) ? result.payload : [];
//         setUserAttendance(attendanceData);
//         console.log("User attendance set:", attendanceData);
//       } else {
//         console.error("Error fetching attendance:", result.error);
//         setUserAttendance([]); // Reset to empty array on error
//       }
//     }).catch(error => {
//       console.error("Exception in fetchUserMonthlyAttendance:", error);
//       setUserAttendance([]); // Reset to empty array on exception
//     });
//   };

//   // When month or year changes, reload attendance
//   useEffect(() => {
//     if (selectedUser) {
//       loadUserAttendance(selectedUser._id);
//     }
//   }, [selectedMonth, selectedYear]);

//   // Toggle attendance status (present/absent)
//   const toggleAttendanceStatus = (record) => {
//     console.log("Toggling attendance status for:", record);
    
//     // If there's a record with check-in but no check-out, mark as absent by deleting
//     if (record._id && (record.checkIn && !record.checkOut)) {
//       dispatch(deleteAttendance(record._id)).then((result) => {
//         console.log("Deleted attendance:", result);
//         loadUserAttendance(selectedUser._id);
//       });
//     } 
//     // If absent (no record), create one with both check-in and check-out
//     else if (!record._id) {
//       const startOfDay = new Date(record.date);
//       startOfDay.setHours(9, 0, 0); // 9:00 AM
      
//       const endOfDay = new Date(record.date);
//       endOfDay.setHours(17, 0, 0); // 5:00 PM
      
//       const payload = {
//         user: selectedUser._id,
//         date: record.date,
//         checkIn: startOfDay,
//         checkOut: endOfDay
//       };
      
//       console.log("Creating attendance with payload:", payload);
//       dispatch(Upsert(payload)).then((result) => {
//         console.log("Created attendance:", result);
//         loadUserAttendance(selectedUser._id);
//       });
//     }
//     // If present (has check-in and check-out), mark as absent by deleting
//     else if (record._id) {
//       console.log("Deleting attendance with ID:", record._id);
//       dispatch(deleteAttendance(record._id)).then((result) => {
//         console.log("Deleted attendance:", result);
//         loadUserAttendance(selectedUser._id);
//       });
//     }
//   };

//   // Generate dates for the selected month and year
//   const getDaysInMonth = () => {
//     const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
//     const dates = [];
    
//     // Make absolutely sure userAttendance is an array
//     const attendanceArray = Array.isArray(userAttendance) ? userAttendance : [];
//     console.log("Using attendance array:", attendanceArray);
    
//     for (let i = 1; i <= daysInMonth; i++) {
//       const currentDate = new Date(selectedYear, selectedMonth - 1, i);
//       // Find attendance record for this date if it exists
//       const attendanceRecord = attendanceArray.find(record => {
//         if (!record || !record.date) return false;
        
//         const recordDate = new Date(record.date);
//         return recordDate.getDate() === i && 
//                recordDate.getMonth() === selectedMonth - 1 && 
//                recordDate.getFullYear() === selectedYear;
//       });
      
//       dates.push({
//         date: currentDate,
//         _id: attendanceRecord?._id || null,
//         checkIn: attendanceRecord?.checkIn || null,
//         checkOut: attendanceRecord?.checkOut || null,
//         present: !!attendanceRecord?.checkIn
//       });
//     }
    
//     return dates;
//   };

//   // Format time for display
//   const formatTime = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   // Get days of the week
//   const getDayOfWeek = (date) => {
//     const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     return days[date.getDay()];
//   };

//   // Render the calendar for the month
//   const renderCalendar = () => {
//     try {
//       const dates = getDaysInMonth();
      
//       return (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border p-2">Date</th>
//                 <th className="border p-2">Day</th>
//                 <th className="border p-2">Status</th>
//                 <th className="border p-2">Check In</th>
//                 <th className="border p-2">Check Out</th>
//                 <th className="border p-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {dates.map((day) => (
//                 <tr key={day.date.toString()} className={day.date.getDay() === 0 || day.date.getDay() === 6 ? 'bg-red-50' : ''}>
//                   <td className="border p-2">{day.date.getDate()}</td>
//                   <td className="border p-2">{getDayOfWeek(day.date)}</td>
//                   <td className="border p-2">
//                     {day.present ? (
//                       <span className="text-green-600 font-semibold">Present</span>
//                     ) : (
//                       <span className="text-red-600 font-semibold">Absent</span>
//                     )}
//                   </td>
//                   <td className="border p-2">{formatTime(day.checkIn)}</td>
//                   <td className="border p-2">{formatTime(day.checkOut)}</td>
//                   <td className="border p-2">
//                     <button
//                       onClick={() => toggleAttendanceStatus(day)}
//                       className={`px-4 py-1 rounded ${
//                         day.present ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
//                       }`}
//                     >
//                       {day.present ? 'Mark Absent' : 'Mark Present'}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       );
//     } catch (error) {
//       console.error("Error rendering calendar:", error);
//       return (
//         <div className="p-4 bg-red-50 text-red-700 rounded">
//           Error displaying calendar. Please try again or contact support.
//         </div>
//       );
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Site Engineers Attendance Management</h1>
      
//       {status === 'loading' ? (
//         <div className="text-center">Loading site engineers...</div>
//       ) : engineers && engineers.length > 0 ? (
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Email
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Position
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {engineers.map((user) => (
//                 <tr key={user._id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-500">{user.email}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-500">Site Engineer</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button
//                       onClick={() => handleViewAttendance(user)}
//                       className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
//                     >
//                       View Records
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="text-center p-4 bg-gray-100 rounded">
//           No site engineers found. Please add engineers to view their attendance.
//         </div>
//       )}

//       {/* Attendance Record Modal */}
//       {showModal && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-screen overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-bold">
//                   Attendance Records: {selectedUser.name}
//                 </h2>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               <div className="flex flex-wrap gap-4 mb-6">
//                 <div className="w-full md:w-auto">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//                   <select
//                     value={selectedMonth}
//                     onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//                     className="w-full rounded-md border border-gray-300 py-2 px-3"
//                   >
//                     {Array.from({ length: 12 }, (_, i) => (
//                       <option key={i + 1} value={i + 1}>
//                         {new Date(0, i).toLocaleString('default', { month: 'long' })}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="w-full md:w-auto">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//                   <select
//                     value={selectedYear}
//                     onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                     className="w-full rounded-md border border-gray-300 py-2 px-3"
//                   >
//                     {Array.from({ length: 5 }, (_, i) => (
//                       <option key={i} value={new Date().getFullYear() - 2 + i}>
//                         {new Date().getFullYear() - 2 + i}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {loading ? (
//                 <div className="text-center py-4">Loading attendance records...</div>
//               ) : (
//                 renderCalendar()
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminAttendance;