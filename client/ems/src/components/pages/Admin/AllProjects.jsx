import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getallProjects, getProjectByInchargeId } from "../../../features/projectSlice";

const ProjectsTable = () => {
  const dispatch = useDispatch();
  const [selectedPlazas, setSelectedPlazas] = useState(null); // State for modal

  const { role } = useSelector((state) => state.auth);
  const { projects, status, error } = useSelector((state) => state.project || { projects: [], status: "idle", error: null });

  useEffect(() => {
    if (role === "projectIncharge") {
      dispatch(getProjectByInchargeId());
    } else {
      dispatch(getallProjects());
    }
  }, [dispatch, role]);

  // Debugging Logs
  console.log("Projects Data:", projects);

  const handleViewPlazas = (plazas) => {
    if (!plazas || plazas.length === 0) return;
    setSelectedPlazas(plazas);
  };

  if (status === "loading") return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p>Error: {error?.message}</p>;

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <h2 className="text-3xl font-bold text-white">Projects Overview</h2>
          <p className="mt-2 text-sm text-blue-100">A list of all ongoing projects with detailed information.</p>
        </div>
        <div className="overflow-x-auto">
          {status === "loading" ? (
            <p className="text-center py-6 text-lg text-gray-600">Loading projects...</p>
          ) : error ? (
            <p className="text-center py-6 text-lg text-red-600">Error: {error?.message}</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Project Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Client Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PIU Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Plazas</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.length > 0 ? (
                  projects.map((project, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-all duration-200 ease-in-out transform hover:scale-105">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.projectName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{project.clientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{project.PIU_Name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{project.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {project.plazas ? project.plazas.length : 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <button
                          onClick={() => handleViewPlazas(project.plazas)}
                          className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-md"
                        >
                          View Plazas
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-lg text-gray-600">No projects available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Mini Screen (Popup) for Plazas */}
      {selectedPlazas && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Plaza Names</h3>
            {selectedPlazas.length > 0 ? (
              <ul className="list-disc pl-4 space-y-2">
                {selectedPlazas.map((plaza, i) => (
                  <li key={i} className="text-gray-700">{plaza.plazaName || "Fetching..."}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No plazas available.</p>
            )}
            <button
              onClick={() => setSelectedPlazas(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
