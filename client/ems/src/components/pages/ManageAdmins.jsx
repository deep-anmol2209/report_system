import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getallactiveAdmins, deleteAdmin } from "../../features/adminSlice";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { FaEdit } from "react-icons/fa"; // Import edit icon

const ManageAdmin = () => {
  const dispatch = useDispatch();
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [updatedAdmin, setUpdatedAdmin] = useState({});

  useEffect(() => {
    dispatch(getallactiveAdmins());
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

  const handleDelete = (admin) => {
    setSelectedAdmin(admin);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (selectedAdmin) {
      await dispatch(deleteAdmin(selectedAdmin.username));
      dispatch(getallactiveAdmins()); // Refresh list after deletion
      setOpenDelete(false);
    }
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setUpdatedAdmin(admin); // Pre-fill form with current details
    setOpenEdit(true);
  };

  const handleUpdateChange = (e) => {
    setUpdatedAdmin({ ...updatedAdmin, [e.target.name]: e.target.value });
  };

  // const handleUpdateSubmit = async () => {
  //   await dispatch(updateAdmin({ _id: updatedAdmin._id, ...updatedAdmin }));
  //   dispatch(getallactiveAdmins()); // Refresh list after update
  //   setOpenEdit(false);
  // };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Manage Admins</h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading admins...</p>
        ) : admins.length === 0 ? (
          <p className="text-center text-gray-600">No Admins Found</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="p-4 text-left">First Name</th>
                    <th className="p-4 text-left">Last Name</th>
                    <th className="p-4 text-left">Username</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Address</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAdmins.map((admin, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100">
                      <td className="p-4">{admin.firstName}</td>
                      <td className="p-4">{admin.lastName}</td>
                      <td className="p-4 text-blue-600 font-medium">{admin.username}</td>
                      <td className="p-4">{admin.email}</td>
                      <td className="p-4">
                        <span className="font-medium">{admin.address.city}, {admin.address.state}</span>
                      </td>
                      <td className="p-4 flex space-x-2">
                        <button onClick={() => handleView(admin)} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">View</button>
                        <button onClick={() => handleDelete(admin)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
                        <button onClick={() => handleEdit(admin)} className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center">
                          <FaEdit className="mr-1" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-4 space-x-4">
              <button className={`px-4 py-2 bg-blue-500 text-white rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
              <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>
              <button className={`px-4 py-2 bg-blue-500 text-white rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`} disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </div>
          </>
        )}
      </div>

      {/* View Admin Modal */}
      <Dialog open={openView} onClose={() => setOpenView(false)}>
        <DialogTitle>Admin Details</DialogTitle>
        <DialogContent>
          {selectedAdmin && (
            <div>
              <p><strong>First Name:</strong> {selectedAdmin.firstName}</p>
              <p><strong>Last Name:</strong> {selectedAdmin.lastName}</p>
              <p><strong>Username:</strong> {selectedAdmin.username}</p>
              <p><strong>Email:</strong> {selectedAdmin.email}</p>
              <p><strong>Address:</strong></p>
              <p className="px-[10px]"><strong>City:</strong> {selectedAdmin.address.city}</p>
              <p className="px-[10px]"><strong>State:</strong>  {selectedAdmin.address.state}</p>
              <p className="px-[10px]"><strong>Home address:</strong> {selectedAdmin.address.homeAddress}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Admin Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Admin</DialogTitle>
        <DialogContent>
          {updatedAdmin && (
            <>
              <TextField label="First Name" name="firstName" value={updatedAdmin.firstName} onChange={handleUpdateChange} fullWidth margin="dense" />
              <TextField label="Last Name" name="lastName" value={updatedAdmin.lastName} onChange={handleUpdateChange} fullWidth margin="dense" />
              <TextField label="Email" name="email" value={updatedAdmin.email} onChange={handleUpdateChange} fullWidth margin="dense" />
              <TextField label="Username" name="username" value={updatedAdmin.username} onChange={handleUpdateChange} fullWidth margin="dense" />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} color="primary">Cancel</Button>
          <Button  color="secondary">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageAdmin;
