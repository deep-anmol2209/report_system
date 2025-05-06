import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveSiteEngineers, deleteSiteEngineer } from "../../features/siteEngineer.js"; // Adjust the path
import { toast, ToastContainer } from "react-toastify";

export default function ManageSiteEngineers() {
  const dispatch = useDispatch();
  const { engineers, status, error } = useSelector((state) => state.siteEngineer);

  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [engineerToDelete, setEngineerToDelete] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false); // NEW
  const [transferEngineer, setTransferEngineer] = useState(null);     // NEW
  const [currentPage, setCurrentPage] = useState(1);
  const [newPlazaId, setNewPlazaId] = useState("");
  const [newProjectId, setNewProjectId] = useState("");
  const [newRole, setNewRole] = useState("");
  const engineersPerPage = 10;

   // Dummy data - replace with your real data sources
   const plazas = [
    { _id: "p1", plazaName: "Plaza A" },
    { _id: "p2", plazaName: "Plaza B" },
    { _id: "p3", plazaName: "Plaza C" },
  ];

  const projects = [
    { _id: "proj1", projectName: "Project Alpha" },
    { _id: "proj2", projectName: "Project Beta" },
    { _id: "proj3", projectName: "Project Gamma" },
  ];

  useEffect(() => {
    dispatch(fetchActiveSiteEngineers());
  }, [dispatch]);

  const handleDelete = (username) => {
    dispatch(deleteSiteEngineer(username));
    if (status === "succeeded") {
      toast.success("Engineer deleted successfully");
    }
    dispatch(fetchActiveSiteEngineers());
    setShowDeleteConfirmation(false);
  };

  const roles = ["plaza_engineer", "plaza_incharge"];

  const handleConfirmTransfer = () => {
    // Send API call or dispatch Redux action here
    toast.success("Engineer transferred successfully!");
    setShowTransferModal(false);
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
              {currentEngineers.map((engineer) => (
                <tr key={engineer._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{engineer.firstName}</td>
                  <td className="py-3 px-4">{engineer.lastName}</td>
                  <td className="py-3 px-4">{engineer.username}</td>
                  <td className="py-3 px-4">{engineer.email}</td>
                  <td className="py-3 px-4">{engineer.assignedPlaza?.plazaName}</td>
                  <td className="py-3 px-4">{engineer.role}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                      onClick={() => setSelectedEngineer(engineer)}
                    >
                      View
                    </button>
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
                      onClick={() => {
                        setTransferEngineer(engineer);
                        setShowTransferModal(true);
                      }}
                    >
                      Transfer
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
              ))}
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
      {showTransferModal && transferEngineer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Transfer Site Engineer</h3>
            
            <div className="mb-3">
              <p><strong>Username:</strong> {transferEngineer.username}</p>
              <p><strong>Current Role:</strong> {transferEngineer.role}</p>
              <p><strong>Current Plaza:</strong> {transferEngineer.assignedPlaza?.plazaName}</p>
              <p><strong>Current Project:</strong> {transferEngineer.assignedProject?.projectName}</p>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Select New Plaza</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                value={newPlazaId}
                onChange={(e) => setNewPlazaId(e.target.value)}
              >
                <option value="">Select Plaza</option>
                {plazas.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.plazaName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Select New Project</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                value={newProjectId}
                onChange={(e) => setNewProjectId(e.target.value)}
              >
                <option value="">Select Project</option>
                {projects.map((proj) => (
                  <option key={proj._id} value={proj._id}>
                    {proj.projectName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Select New Role</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition"
                onClick={() => setShowTransferModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
                onClick={handleConfirmTransfer}
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    
    

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
    </div>
  );
}
