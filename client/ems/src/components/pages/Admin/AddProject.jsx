import { useState, useEffect } from "react";
import { FaProjectDiagram, FaUserTie, FaUserCheck, FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addProject } from "../../../features/projectSlice";
import { getallProjectIncharge } from "../../../features/projectInchargeSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProject = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    assignedTo: "",
    PIU_Name: "",
    location: ""
  });

  const dispatch = useDispatch();

  // Select incharge data from projectIncharge slice only
  const { incharge = [], status, error } = useSelector(
    (state) => state.projectIncharge || {}
  );

  // Fetch incharge list if not already fetched
  useEffect(() => {
    if (status === "idle") {
      dispatch(getallProjectIncharge());
    }
  }, [status, dispatch]);

  useEffect(() => {
    console.log("Updated incharge:", incharge);
  }, [incharge]);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit handler with immediate toast notifications
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addProject(formData)).unwrap();
      toast.success("Project added successfully!");
      // Optionally, reset the form if needed:
      setFormData({
        projectName: "",
        clientName: "",
        assignedTo: "",
        PIU_Name: "",
        location: ""
      });
    } catch (err) {
      toast.error(`Error: ${err || "Failed to add project"}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-4xl">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Add Project
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {[
            { label: "Project Name", name: "projectName", icon: <FaProjectDiagram /> },
            { label: "Client Name", name: "clientName", icon: <FaUserTie /> },
            { label: "PIU Name", name: "PIU_Name", icon: <FaBuilding /> },
            { label: "Location", name: "location", icon: <FaMapMarkerAlt /> }
          ].map(({ label, name, icon }) => (
            <div key={name} className="block">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                {label}
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                <span className="p-3 text-gray-500 bg-gray-100">{icon}</span>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-4 border-0 focus:ring-0 focus:outline-none"
                  required
                />
              </div>
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Assigned To
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <span className="p-3 text-gray-500 bg-gray-100">
                <FaUserCheck />
              </span>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full p-3 border-0 focus:ring-0 focus:outline-none"
                
              >
                <option value="">Select Assignee</option>
                {incharge
                  .filter((inch) => inch.role === "projectIncharge")
                  .map((inch) => (
                    <option key={inch._id} value={inch._id}>
                      {inch.username}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white py-3 rounded-lg text-lg font-semibold shadow-md transition"
            >
              Add Project
            </button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
      </div>
    </div>
  );
};

export default AddProject;
