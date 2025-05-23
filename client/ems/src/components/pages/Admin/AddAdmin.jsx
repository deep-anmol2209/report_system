import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaCity, FaGlobe } from "react-icons/fa";
import { addnewAdmin, getallAdmins } from "../../../features/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    address: {
      city: "",
      state: "",
      homeAddress: "",
    },
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      const field = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        address: { ...prevData.address, [field]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addnewAdmin(formData)).unwrap();
      dispatch(getallAdmins())
      dispatch(getallAdmins())
      toast.success("Admin added successfully!", { position: "top-right" });
      setFormData({ firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        address: {
          city: "",
          state: "",
          homeAddress: "",
        },})
    } catch (error) {
      toast.error("Failed to add admin!", { position: "top-right" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-4xl">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Add Admin</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2  gap-6">
          {[
            { label: "First Name", name: "firstName", icon: <FaUser /> },
            { label: "Last Name", name: "lastName", icon: <FaUser /> },
            { label: "Email", name: "email", type: "email", icon: <FaEnvelope /> },
            { label: "Username", name: "username", icon: <FaUser /> },
            { label: "Password", name: "password", type: "password", icon: <FaLock /> },
            { label: "Home Address", name: "address.homeAddress", icon: <FaMapMarkerAlt /> },
            { label: "City", name: "address.city", icon: <FaCity /> },
            { label: "State", name: "address.state", icon: <FaGlobe /> },
          ].map(({ label, name, type = "text", icon }) => (
            <div key={name} className=" flex flex-col">
              <label className="block text-gray-700 text-sm font-medium mb-1">{label}</label>
              <div className="flex items-center border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                <span className="p-3 text-gray-500 bg-gray-100">{icon}</span>
                <input
                  type={type}
                  name={name}
                  value={name.includes("address.") ? formData.address[name.split(".")[1]] : formData[name]}
                  onChange={handleChange}
                  className="w-full p-3 border-0 focus:ring-0 focus:outline-none"
                  required
                />
              </div>
            </div>
          ))}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white py-3 rounded-lg text-lg font-semibold shadow-md transition"
            >
              Add Admin
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddAdmin;
