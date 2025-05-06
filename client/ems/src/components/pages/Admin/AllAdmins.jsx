import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getallAdmins } from "../../../features/adminSlice";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const AllAdmin = () => {
  const dispatch = useDispatch();
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [openView, setOpenView] = useState(false);
  
  useEffect(() => {
    dispatch(getallAdmins());
  }, [dispatch]);

  const adminsState = useSelector((state) => state.admins || { list: [], loading: false, error: null });
  const { list: admins = [], loading, error } = adminsState;

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(admins.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedAdmins = admins.slice(startIndex, startIndex + recordsPerPage);

  const handleView = (admin) => {
    setSelectedAdmin(admin);
    setOpenView(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-4 sm:mb-6">All Admins</h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading admins...</p>
        ) : admins.length === 0 ? (
          <p className="text-center text-gray-600">No Admins Found</p>
        ) : (
          <>
            <div className="overflow-x-auto w-full">
              <div className="md:hidden space-y-4">
                {paginatedAdmins.map((admin, index) => (
                  <div key={index} className="border rounded-lg p-4 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">First Name</p>
                        <p>{admin.firstName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Name</p>
                        <p>{admin.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Username</p>
                        <p className="text-blue-600 font-medium">{admin.username}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p>{admin.email}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p>{admin.address.city}, {admin.address.state}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button 
                        onClick={() => handleView(admin)} 
                        className="w-full px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <table className="hidden md:table w-full text-sm md:text-base bg-white shadow-md rounded-lg">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="p-2 md:p-4 text-left">First Name</th>
                    <th className="p-2 md:p-4 text-left">Last Name</th>
                    <th className="p-2 md:p-4 text-left">Username</th>
                    <th className="p-2 md:p-4 text-left">Email</th>
                    <th className="p-2 md:p-4 text-left">Address</th>
                    <th className="p-2 md:p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAdmins.map((admin, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100">
                      <td className="p-2 md:p-4">{admin.firstName}</td>
                      <td className="p-2 md:p-4">{admin.lastName}</td>
                      <td className="p-2 md:p-4 text-blue-600 font-medium">{admin.username}</td>
                      <td className="p-2 md:p-4">{admin.email}</td>
                      <td className="p-2 md:p-4">
                        <span className="font-medium">{admin.address.city}, {admin.address.state}</span>
                      </td>
                      <td className="p-2 md:p-4">
                        <button 
                          onClick={() => handleView(admin)} 
                          className="px-2 py-1 sm:px-3 sm:py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs sm:text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center mt-4 gap-2 sm:gap-4">
              <button 
                className={`px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                } text-sm sm:text-base`} 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span className="text-gray-700 font-medium text-sm sm:text-base">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                className={`px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                } text-sm sm:text-base`} 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* View Admin Modal */}
      <Dialog 
        open={openView} 
        onClose={() => setOpenView(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="text-lg sm:text-xl">Admin Details</DialogTitle>
        <DialogContent>
          {selectedAdmin && (
            <div className="space-y-3 text-gray-700 text-sm sm:text-base">
              <p><strong>First Name:</strong> {selectedAdmin.firstName}</p>
              <p><strong>Last Name:</strong> {selectedAdmin.lastName}</p>
              <p><strong>Username:</strong> {selectedAdmin.username}</p>
              <p><strong>Email:</strong> {selectedAdmin.email}</p>
              <p><strong>Address:</strong> {selectedAdmin.address.city}, {selectedAdmin.address.state}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenView(false)} 
            color="primary"
            className="text-sm sm:text-base"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllAdmin;