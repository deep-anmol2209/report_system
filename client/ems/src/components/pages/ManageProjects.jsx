import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getallProjects, updateProject } from "../../features/projectSlice";
import { getallProjectIncharge } from "../../features/projectInchargeSlice";

const ManageProjects = () => {
  const dispatch = useDispatch();
  const { projects, status, error } = useSelector((state) => state.project);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editData, setEditData] = useState({});

  // Select incharge data from projectIncharge slice only
  const { incharge = [], status: inchargeStatus, error: inchargeError } = useSelector(
    (state) => state.projectIncharge || {}
  );

  // Fetch incharge list if not already fetched
  useEffect(() => {
    if (inchargeStatus === 'idle') {
      dispatch(getallProjectIncharge());
    }
  }, [inchargeStatus, dispatch]);
  
  useEffect(() => {
    dispatch(getallProjects());
  }, [dispatch]);

  const handleEdit = (project) => {
    setSelectedProject(project);
    setEditData({ ...project });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setEditData((prevData) => ({
      ...prevData,
      [name]: name === "assignedTo" ? value : value, // Ensure assignedTo stores only the ID
    }));
  };

  const handleSave = () => {
    const updatedData = {
      ...editData,
      assignedTo: editData.assignedTo?._id || editData.assignedTo, // Ensure only ObjectId is sent
    };
  
    dispatch(updateProject({ id: selectedProject._id, formData: updatedData }));
    setSelectedProject(null);
  };
  
  if (status === "loading") return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  return (
    <div className="p-4 md:p-6 bg-gradient-to-r from-gray-50 to-blue-50 min-h-screen ">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="px-4 py-6 md:px-6 md:py-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h2 className="text-2xl md:text-3xl font-bold">Manage Projects</h2>
          <p className="mt-2 text-xs md:text-sm">Edit and manage project details efficiently.</p>
        </div>
        <div className="">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Project Name</th>
                <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Client Name</th>
                <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Assigned To</th>
                <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase">PIU Name</th>
                <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase">PIU Location</th>
                <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 gap-4">
              {projects.map((project) => (
                <tr key={project.id} className=" hover:bg-gray-50 block md:table-row">
                  <td className="flex flex-row gap-4 px-3 py-2 md:px-6 md:py-4 text-sm font-medium text-gray-900 block md:table-cell before:content-[attr(data-label)] md:before:content-none before:font-semibold before:text-xs before:text-gray-700 before:uppercase" data-label="Project Name">
                    {project.projectName}
                  </td>
                  <td className="flex flex-row gap-4 px-3 py-2 md:px-6 md:py-4 text-sm text-gray-600 block md:table-cell before:content-[attr(data-label)] md:before:content-none before:font-semibold before:text-xs before:text-gray-700 before:uppercase" data-label="Client Name">
                    {project.clientName}
                  </td>
                  <td className="flex flex-row gap-4 px-3 py-2 md:px-6 md:py-4 text-sm text-gray-600 block md:table-cell before:content-[attr(data-label)] md:before:content-none before:font-semibold before:text-xs before:text-gray-700 before:uppercase" data-label="Assigned To">
                    {project?.assignedTo?.username || "Not Assigned"}
                  </td>
                  <td className="flex flex-row gap-4 px-3 py-2 md:px-6 md:py-4 text-sm text-gray-600 block md:table-cell before:content-[attr(data-label)] md:before:content-none before:font-semibold before:text-xs before:text-gray-700 before:uppercase" data-label="PIU Name">
                    {project.PIU_Name}
                  </td>
                  <td className="flex flex-row gap-4 px-3 py-2 md:px-6 md:py-4 text-sm text-gray-600 block md:table-cell before:content-[attr(data-label)] md:before:content-none before:font-semibold before:text-xs before:text-gray-700 before:uppercase" data-label="PIU Location">
                    {project.location}
                  </td>
                  <td className="flex flex-row gap-4 px-3 py-2 md:px-6 md:py-4 text-sm text-gray-600 block md:table-cell before:content-[attr(data-label)] md:before:content-none before:font-semibold before:text-xs before:text-gray-700 before:uppercase" data-label="Actions">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-md"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full md:w-1/3 mx-4">
            <h3 className="text-lg font-bold mb-4">Edit Project</h3>
            <input
              type="text"
              name="projectName"
              value={editData.projectName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-3"
              placeholder="Project Name"
            />
            <input
              type="text"
              name="clientName"
              value={editData.clientName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-3"
              placeholder="Client Name"
            />
            <input
              type="text"
              name="PIU_Name"
              value={editData.PIU_Name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-3"
              placeholder="PIU Name"
            />
            <input
              type="text"
              name="location"
              value={editData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-3"
              placeholder="Location"
            />
            <select
              name="assignedTo"
              value={editData.assignedTo?._id}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md mb-3"
            >
              <option value="">Select Assigned To</option>
              {incharge
                  .filter((inch) => inch.role === "projectIncharge")
                  .map((inch) => (
                    <option key={inch._id} value={inch._id}>
                      {inch.username}
                    </option>
                  ))}
            </select>
            <div className="flex justify-end gap-2 md:gap-4">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-3 py-1 md:px-4 md:py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 text-xs md:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 md:px-4 md:py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 text-xs md:text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;