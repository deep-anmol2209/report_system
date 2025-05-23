import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveSiteEngineers, deleteSiteEngineer } from "../../features/siteEngineer.js"; // Adjust the path
import { toast, ToastContainer } from "react-toastify";
import { deleteUser, updateUser } from "../../features/userSlice.js";

export default function ManageSiteEngineers() {
  const dispatch = useDispatch();
  const { engineers, status, error } = useSelector((state) => state.siteEngineer);

  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [editEngineer, setEditEngineer] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [engineerToDelete, setEngineerToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const engineersPerPage = 10;
  
   // Dummy data - replace with your real data sources
  //  const plazas = [
  //   { _id: "p1", plazaName: "Plaza A" },
  //   { _id: "p2", plazaName: "Plaza B" },
  //   { _id: "p3", plazaName: "Plaza C" },
  // ];

  // const projects = [
  //   { _id: "proj1", projectName: "Project Alpha" },
  //   { _id: "proj2", projectName: "Project Beta" },
  //   { _id: "proj3", projectName: "Project Gamma" },
  // ];

  useEffect(() => {
    dispatch(fetchActiveSiteEngineers());
  }, [dispatch]);

 const handleDelete = (username) => {
    dispatch(deleteUser(username)).then(() => {
      toast.success("Engineer deleted successfully");
      dispatch(fetchActiveSiteEngineers());
      setShowDeleteConfirmation(false);
    });
  };

  const handleUpdate = () => {
    if (!editEngineer) return;
    dispatch(updateUser({ id: editEngineer._id, updatedData: editEngineer })).then(() => {
      toast.success("Engineer updated successfully");
      setEditEngineer(null);
      dispatch(fetchActiveSiteEngineers());
    });
  };
  const indexOfLastEngineer = currentPage * engineersPerPage;
  const indexOfFirstEngineer = indexOfLastEngineer - engineersPerPage;
  const currentEngineers = engineers.slice(indexOfFirstEngineer, indexOfLastEngineer);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">All Site Engineers</h2>
      {status === "loading" && <p className="text-blue-500 text-lg">Loading site engineers...</p>}
      {status === "failed" && <p className="text-red-500 text-lg">Error: {error}</p>}

      {status === "succeeded" && engineers.length > 0 && (
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white text-left">
                {["First Name", "Last Name", "Username", "Email", "Plaza", "Role", "Actions"].map((heading) => (
                  <th key={heading} className="py-3 px-4 text-lg">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentEngineers.map((engineer) => {
                 const latestRole = engineer.roleHistory?.[engineer.roleHistory.length - 1];
                return(
                <tr key={engineer._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{engineer.firstName}</td>
                  <td className="py-3 px-4">{engineer.lastName}</td>
                  <td className="py-3 px-4">{engineer.username}</td>
                  <td className="py-3 px-4">{engineer.email}</td>
                  <td className="py-3 px-4">{latestRole?.assignedEntity?.projectName || latestRole?.assignedEntity?.plazaName || "N/A"}</td>
                  <td className="py-3 px-4">{latestRole?.role || "N/A"}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                      onClick={() => setSelectedEngineer(engineer)}
                    >
                      View
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
                        onClick={() => setEditEngineer(engineer)}
                      >
                        Update
                      </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
                      onClick={() => {
                        setEngineerToDelete(engineer);
                        setShowDeleteConfirmation(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {selectedEngineer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Engineer Details</h3>
            <p><strong>First Name:</strong> {selectedEngineer.firstName}</p>
            <p><strong>Last Name:</strong> {selectedEngineer.lastName}</p>
            <p><strong>Username:</strong> {selectedEngineer.username}</p>
            <p><strong>Email:</strong> {selectedEngineer.email}</p>
            <p><strong>Plaza:</strong> {selectedEngineer.assignedPlaza?.plazaName}</p>
            <p><strong>Role:</strong> {selectedEngineer.role}</p>
            <p><strong>Address: </strong></p>
            <p className="px-[10px]"><strong>City: </strong>{selectedEngineer.address?.city}</p>
            <p className="px-[10px]"><strong>State: </strong>{selectedEngineer.address?.state}</p>
            <p className="px-[10px]"><strong>Home address: </strong>{selectedEngineer.address?.homeAddress}</p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition"
                onClick={() => setSelectedEngineer(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Update Modal */}
      {/* Update Modal */}
      {editEngineer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Engineer</h3>

            <input
              className="w-full mb-2 p-2 border rounded"
              value={editEngineer.firstName}
              onChange={(e) => setEditEngineer({ ...editEngineer, firstName: e.target.value })}
              placeholder="First Name"
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              value={editEngineer.lastName}
              onChange={(e) => setEditEngineer({ ...editEngineer, lastName: e.target.value })}
              placeholder="Last Name"
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              value={editEngineer.email}
              onChange={(e) => setEditEngineer({ ...editEngineer, email: e.target.value })}
              placeholder="Email"
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              value={editEngineer.address?.city || ""}
              onChange={(e) =>
                setEditEngineer({
                  ...editEngineer,
                  address: { ...editEngineer.address, city: e.target.value },
                })
              }
              placeholder="City"
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              value={editEngineer.address?.state || ""}
              onChange={(e) =>
                setEditEngineer({
                  ...editEngineer,
                  address: { ...editEngineer.address, state: e.target.value },
                })
              }
              placeholder="State"
            />

            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition"
                onClick={() => setEditEngineer(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete {engineerToDelete?.firstName} {engineerToDelete?.lastName}?</p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
                onClick={() => handleDelete(engineerToDelete.username)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      
    
    

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
    </div>
  );
}
