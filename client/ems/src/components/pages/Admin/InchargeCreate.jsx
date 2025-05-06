import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchSiteEngineers } from "../../../features/siteEngineer";
import { Loader2 } from "lucide-react"; // optional: `npm install lucide-react`
import { changeRole } from "../../../features/projectInchargeSlice";
import { getallProjects } from "../../../features/projectSlice";
import { fetchPlazas } from "../../../features/plazaSlice";
const InchargeCreate = () => {
  const dispatch = useDispatch();
  const { engineers, status, error } = useSelector((state) => state.siteEngineer);
  const { projects, status: projectStatus, error: projectError } = useSelector((state) => state.project || { projects: [], status: "idle", error: null });

  const { plazas = [], status: [lazaStatus], error: plazaError } = useSelector((state) => state.plaza) || {}; 



  const [formData, setFormData] = useState({
    userId: "",
    newRole: "",
    assignedEntityType: "",
    assignedEntityId: "",
  });

  useEffect(()=>{
    dispatch(getallProjects())
    dispatch(fetchPlazas())
  },[])

  useEffect(() => {
    dispatch(fetchSiteEngineers());
   
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "assignedEntityType") {
      setFormData((prev) => ({ ...prev, [name]: value, assignedEntityId: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      console.log(payload);
      
     dispatch(changeRole(payload))
      alert("✅ Role changed successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 max-w-2xl mx-auto bg-gradient-to-tr from-white to-slate-50 border border-gray-200 shadow-md rounded-xl space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">Change User Role</h2>

      {/* User Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
        <select
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Select User --</option>
          {status === "loading" ? (
            <option disabled>Loading...</option>
          ) : (
            engineers?.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username || user.email}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Role Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">New Role</label>
        <select
          name="newRole"
          value={formData.newRole}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Select Role --</option>
          <option value="site_engineer">Site Engineer</option>
          <option value="plaza_incharge">Plaza Incharge</option>
          <option value="project_incharge">Project Incharge</option>
        </select>
      </div>

      {/* Assigned Entity Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
        <select
          name="assignedEntityType"
          value={formData.assignedEntityType}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Select Entity Type --</option>
          <option value="Plaza">Plaza</option>
          <option value="Project">Project</option>
        </select>
      </div>

      {/* Assigned Entity Selection */}
      {formData.assignedEntityType === "Plaza" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Plaza</label>
          <select
            name="assignedEntityId"
            value={formData.assignedEntityId}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select Plaza --</option>
            {plazas.map((plaza) => (
              <option key={plaza._id} value={plaza._id}>
                {plaza.plazaName}
              </option>
            ))}
          </select>
        </div>
      )}

      {formData.assignedEntityType === "Project" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Project</label>
          <select
            name="assignedEntityId"
            value={formData.assignedEntityId}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select Project --</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>
      )}

    {/* From Date */}
    <div>
        <label className="block text-gray-700 mb-1 font-medium">From Date</label>
        <input
          type="date"
          name="fromDate"
          value={formData.fromDate}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Submit Button */}
      <div className="text-center pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition"
        >
          {status === "loading" ? <Loader2 className="animate-spin w-5 h-5" /> : "Change Role"}
        </button>
      </div>
    </form>
  );
};

export default InchargeCreate;
