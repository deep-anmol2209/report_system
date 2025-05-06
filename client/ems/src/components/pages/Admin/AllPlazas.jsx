import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlazas } from "../../../features/plazaSlice";
import { getEngineerNamesByIds } from "../../../features/siteEngineer";

const ProjectsTable = () => {
  const dispatch = useDispatch();
  const { plazas = [], status, error } = useSelector((state) => state.plaza) || {}; // Default to empty array
  const [selectedPlaza, setSelectedPlaza] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    dispatch(fetchPlazas());
  }, [dispatch]); // Ensures dispatch doesn't cause unnecessary re-renders

  const handleViewEmployees = async (plaza) => {
    if (!plaza) return;
    
    setSelectedPlaza(plaza);
    setIsModalOpen(true);

    if (Array.isArray(plaza?.assignedTo) && plaza.assignedTo.length > 0) {
      let isMounted = true;
      try {
        const result = await dispatch(getEngineerNamesByIds(plaza.assignedTo)).unwrap();
        if (isMounted) setEmployees(result || []);
      } catch (err) {
        console.error("Failed to fetch employee names:", err);
      }

      return () => { isMounted = false }; // Cleanup to prevent memory leaks
    } else {
      setEmployees([]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlaza(null);
    setEmployees([]);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <h2 className="text-3xl font-bold text-white">Plaza Overview</h2>
          <p className="mt-2 text-sm text-blue-100">
            Click "View Employees" to see employee details.
          </p>
        </div>
        {status === "loading" && <p className="text-center py-4">Loading plazas...</p>}
        {error && <p className="text-center py-4 text-red-600">{error}</p>}
        {status === "succeeded" && plazas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Plaza Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    PIU Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Total Employees
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plazas.map((plaza) => (
                  <tr key={plaza._id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {plaza.plazaName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {plaza?.project?.location || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {plaza?.project?.PIU_Name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                        {plaza?.assignedTo?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <button
                        onClick={() => handleViewEmployees(plaza)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        View Employees
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-4">No plazas available.</p>
        )}
      </div>

      {isModalOpen && selectedPlaza && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl w-11/12 md:w-1/2 lg:w-1/3 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Employees in {selectedPlaza.plazaName}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {employees.length > 0 ? (
              <ul className="space-y-2">
                {employees.map((employee, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {employee.firstName} {employee.lastName}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No employees found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
