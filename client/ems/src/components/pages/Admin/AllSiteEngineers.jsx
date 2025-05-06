import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSiteEngineers } from "../../../features/siteEngineer";

export default function AllSiteEngineer() {
  const dispatch = useDispatch();
  const { engineers, status, error } = useSelector((state) => state.siteEngineer);

  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [historyEngineer, setHistoryEngineer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const engineersPerPage = 10;

  useEffect(() => {
    dispatch(fetchSiteEngineers());
  }, [dispatch]);

  const indexOfLastEngineer = currentPage * engineersPerPage;
  const indexOfFirstEngineer = indexOfLastEngineer - engineersPerPage;
  const currentEngineers = engineers.slice(indexOfFirstEngineer, indexOfLastEngineer);
  const totalPages = Math.ceil(engineers.length / engineersPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          All Site Engineers
        </h2>

        {status === "loading" && (
          <p className="text-center text-blue-500">Loading site engineers...</p>
        )}
        {status === "failed" && (
          <p className="text-center text-red-500">Error: {error}</p>
        )}

        {status === "succeeded" && engineers.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
            {/* Mobile View */}
            <div className="sm:hidden space-y-4">
              {currentEngineers.map((engineer) => {
                const latestRole = engineer.roleHistory?.[engineer.roleHistory.length - 1];
                return (
                  <div key={engineer._id} className="border rounded-lg p-4 shadow-sm">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div><p className="text-xs text-gray-500">First Name</p><p>{engineer.firstName}</p></div>
                      <div><p className="text-xs text-gray-500">Last Name</p><p>{engineer.lastName}</p></div>
                      <div><p className="text-xs text-gray-500">Username</p><p>{engineer.username}</p></div>
                      <div><p className="text-xs text-gray-500">Email</p><p>{engineer.email}</p></div>
                      <div><p className="text-xs text-gray-500">Role</p><p>{latestRole?.role || "N/A"}</p></div>
                      <div><p className="text-xs text-gray-500">Assigned To</p><p>{latestRole?.assignedEntity?.projectName || latestRole?.assignedEntity?.plazaName || "N/A"}</p></div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedEngineer(engineer)}
                        className="bg-blue-500 text-white rounded-md py-2 text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => setHistoryEngineer(engineer)}
                        className="bg-green-500 text-white rounded-md py-2 text-sm"
                      >
                        View History
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View */}
            <table className="hidden sm:table w-full">
              <thead>
                <tr className="bg-blue-600 text-white text-left">
                  <th className="px-4 py-3">First Name</th>
                  <th className="px-4 py-3">Last Name</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Assigned To</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEngineers.map((engineer) => {
                  const latestRole = engineer.roleHistory?.[engineer.roleHistory.length - 1];
                  return (
                    <tr key={engineer._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{engineer.firstName}</td>
                      <td className="px-4 py-3 text-sm">{engineer.lastName}</td>
                      <td className="px-4 py-3 text-sm">{engineer.username}</td>
                      <td className="px-4 py-3 text-sm">{engineer.email}</td>
                      <td className="px-4 py-3 text-sm">{latestRole?.assignedEntity?.projectName || latestRole?.assignedEntity?.plazaName || "N/A"}</td>
                      <td className="px-4 py-3 text-sm">{latestRole?.role || "N/A"}</td>
                      <td className="px-4 py-3 text-sm flex gap-2">
                        <button
                          className="bg-blue-500 text-white rounded-md px-3 py-1 text-xs"
                          onClick={() => setSelectedEngineer(engineer)}
                        >
                          View
                        </button>
                        <button
                          className="bg-green-500 text-white rounded-md px-3 py-1 text-xs"
                          onClick={() => setHistoryEngineer(engineer)}
                        >
                          View History
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <button
                className={`py-2 px-4 rounded-md text-white ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                className={`py-2 px-4 rounded-md text-white ${indexOfLastEngineer >= engineers.length ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={indexOfLastEngineer >= engineers.length}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedEngineer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedEngineer(null)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">{selectedEngineer.firstName} {selectedEngineer.lastName}</h3>
            <p><strong>Username:</strong> {selectedEngineer.username}</p>
            <p><strong>Email:</strong> {selectedEngineer.email}</p>
            <p><strong>Phone:</strong> {selectedEngineer.phoneNO || 'N/A'}</p>
            <p><strong>Role:</strong> {selectedEngineer.roleHistory?.[selectedEngineer.roleHistory.length - 1]?.role || 'N/A'}</p>
            <p><strong>Assigned To:</strong> {selectedEngineer.roleHistory?.[selectedEngineer.roleHistory.length - 1]?.assignedEntity?.projectName || selectedEngineer.roleHistory?.[selectedEngineer.roleHistory.length - 1]?.assignedEntity?.plazaName || 'N/A'}</p>
            <div className="mt-3">
              <p><strong>City:</strong> {selectedEngineer.address?.city || 'N/A'}</p>
              <p><strong>State:</strong> {selectedEngineer.address?.state || 'N/A'}</p>
              <p><strong>Address:</strong> {selectedEngineer.address?.homeAddress || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ View History Modal */}
      {historyEngineer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative overflow-y-auto max-h-[80vh]">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setHistoryEngineer(null)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Role History - {historyEngineer.firstName} {historyEngineer.lastName}</h3>
            {historyEngineer.roleHistory && historyEngineer.roleHistory.length > 0 ? (
              <ul className="space-y-3">
                {historyEngineer.roleHistory.map((role, index) => (
                  <li key={index} className="border p-3 rounded-md bg-gray-50">
                    <p><strong>Role:</strong> {role.role}</p>
                    <p><strong>Assigned To:</strong> {role.assignedEntity?.projectName || role.assignedEntity?.plazaName || 'N/A'}</p>
                    <p><strong>From:</strong> {new Date(role.from).toLocaleDateString()}</p>
                    <p><strong>To:</strong> { role.to? (new Date(role.to).toLocaleDateString()): "Null"}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No role history available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
