import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaMapMarkerAlt, FaBuilding, FaTasks, FaUserTie } from "react-icons/fa";
import { getProjectByInchargeId } from "../../features/projectSlice"; // Adjust import path if needed

const SingleProject = () => {
  const dispatch = useDispatch();
  const { projects, status, error } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(getProjectByInchargeId());
  }, [dispatch]);

  if (status === "loading") {
    return <p className="text-center text-gray-600 mt-10">Loading project details...</p>;
  }

  if (status === "failed") {
    return <p className="text-center text-red-600 mt-10">Error: {error}</p>;
  }

  if (!projects || projects.length === 0) {
    return <p className="text-center text-gray-600 mt-10">No projects assigned.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6 flex justify-center">
      <div className="max-w-6xl w-full">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">Assigned Projects</h2>

        {projects.map((project, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-2xl overflow-hidden p-8 mb-6">
            <h3 className="text-3xl font-bold text-gray-800">{project.projectName}</h3>
            <p className="text-gray-500 text-lg">{project.clientName}</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center bg-blue-100 p-4 rounded-lg shadow-md">
                <FaBuilding className="text-blue-600 text-3xl mr-4" />
                <div>
                  <p className="text-gray-700 font-semibold">PIU Name</p>
                  <p className="text-gray-600">{project.PIU_Name}</p>
                </div>
              </div>

              <div className="flex items-center bg-purple-100 p-4 rounded-lg shadow-md">
                <FaMapMarkerAlt className="text-purple-600 text-3xl mr-4" />
                <div>
                  <p className="text-gray-700 font-semibold">Location</p>
                  <p className="text-gray-600">{project.location}</p>
                </div>
              </div>

              <div className="flex items-center bg-green-100 p-4 rounded-lg shadow-md">
                <FaTasks className="text-green-600 text-3xl mr-4" />
                <div>
                  <p className="text-gray-700 font-semibold">Total Plazas</p>
                  <p className="text-gray-600">{project.plazas ? project.plazas.length : 0}</p>
                </div>
              </div>

              <div className="flex items-center bg-yellow-100 p-4 rounded-lg shadow-md">
                <FaUserTie className="text-yellow-600 text-3xl mr-4" />
                <div>
                  <p className="text-gray-700 font-semibold">Incharge</p>
                  <p className="text-gray-600">{project.assignedTo.username || "Not Assigned"}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-gray-800">Plazas</h3>
              <ul className="mt-4 space-y-3">
                {project.plazas && project.plazas.length > 0 ? (
                  project.plazas.map((plaza, i) => (
                    <li key={i} className="bg-gray-100 p-3 rounded-lg shadow">
                      {plaza.plazaName}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No plazas available.</p>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleProject;
