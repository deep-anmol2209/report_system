import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProjectIncharge } from "../../../features/projectInchargeSlice";
import { getallProjects } from "../../../features/projectSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure Toastify styles are included

const AddIncharge = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNO: "", // Ensure this matches your backend schema
    username: "",
    password: "",
    isEngineerAlso: "",
    email: "",
    assignedProject: "",
    address: {
      city: "",
      state: "",
      homeAddress: "",
    },
  });

  const dispatch = useDispatch();
  const { projects = [], status } = useSelector((state) => state.project || {});

  useEffect(() => {
    if (status === "idle") {
      dispatch(getallProjects());
    }
  }, [status, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Convert string "true"/"false" to boolean
    const parsedValue = value === 'true' ? true : value === 'false' ? false : value;
  
    setFormData((prevState) => {
      if (name in prevState.address) {
        return {
          ...prevState,
          address: { ...prevState.address, [name]: parsedValue },
        };
      }
      return { ...prevState, [name]: parsedValue };
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      
      const response = await dispatch(addProjectIncharge(formData)).unwrap();
      toast.success("Project Incharge added successfully!");

      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        phoneNO: "",
        username: "",
        password: "",
        isEngineerAlso: "",
        email: "",
        assignedProject: "",
        address: { city: "", state: "", homeAddress: "" },
      });
    } catch (error) {
      toast.error(error.message || "Failed to add Project Incharge.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Add Incharge
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-gray-600 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-600 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Phone No */}
          <div>
            <label className="block text-gray-600 mb-1">Phone No</label>
            <input
              type="text"
              name="phoneNO"
              value={formData.phoneNO}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-600 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Assigned Project - Dropdown */}
          <div>
            <label className="block text-gray-600 mb-1">Assigned Project</label>
            <select
              name="assignedProject"
              value={formData.assignedProject}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"

            >
              <option value="" disabled>
                Select a project
              </option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.projectName}
                </option>
              ))}
            </select>
          </div>




          <div>
            <label className="block text-gray-600 mb-1">IsEngineer</label>
            <select
              name="isEngineerAlso"
              value={formData.isEngineerAlso}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>
                Select value
              </option>
              <option value="true">True</option>
            </select>
          </div>











          {/* City */}
          <div>
            <label className="block text-gray-600 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.address.city}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-gray-600 mb-1">State</label>
            <input
              type="text"
              name="state"
              value={formData.address.state}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Home Address */}
          <div className="md:col-span-2">
            <label className="block text-gray-600 mb-1">Home Address</label>
            <textarea
              name="homeAddress"
              value={formData.address.homeAddress}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="w-full md:w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Add Incharge
            </button>
          </div>
        </form>

        {/* Toast Container for Notifications */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
      </div>
    </div>
  );
};

export default AddIncharge;