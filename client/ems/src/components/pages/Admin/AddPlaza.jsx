import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPlaza, fetchPlazas, clearError } from "../../../features/plazaSlice";
import { getallProjects } from "../../../features/projectSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPlaza = () => {
  const [formData, setFormData] = useState({
    plazaName: "",
    project: "",
  });

  const dispatch = useDispatch();
  const { projects = [], status: projectStatus } = useSelector((state) => state.project || {});
  const { status: plazaStatus, error } = useSelector((state) => state.plaza || {});

  useEffect(() => {
    if (projectStatus === "idle") {
      dispatch(getallProjects());
    }
  }, [projectStatus, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const resultAction = await dispatch(addPlaza(formData));
      
      if (addPlaza.fulfilled.match(resultAction)) {
        toast.success("Plaza added successfully!");
        setFormData({ plazaName: "", project: "" });
        dispatch(fetchPlazas());
        
      } else {
        throw new Error(resultAction.payload || "Failed to add plaza");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while adding the plaza");
      dispatch(clearError())
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full transition-all duration-300 transform hover:scale-105">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add Plaza</h2>

        {projectStatus === "loading" && <p className="text-center text-blue-500">Loading projects...</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Plaza Name</label>
            <input
              type="text"
              name="plazaName"
              value={formData.plazaName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Enter plaza name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Project</label>
            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white transition-all"
              required
            >
              <option value="">Select Project</option>
              {projects.map((pr) => (
                <option key={pr._id} value={pr._id}>
                  {pr.projectName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg transition-all duration-200 ${
              plazaStatus === "loading"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:shadow-lg"
            }`}
            disabled={plazaStatus === "loading"}
          >
            {plazaStatus === "loading" ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
    </div>
  );
};

export default AddPlaza;
