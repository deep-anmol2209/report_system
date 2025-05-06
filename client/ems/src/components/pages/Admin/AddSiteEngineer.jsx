import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlazas } from "../../../features/plazaSlice.js";
import { fetchSiteEngineers, addSiteEngineer } from "../../../features/siteEngineer.js"; // Import addEngineer action
import { toast, ToastContainer } from "react-toastify";

export default function AddSiteEngineer() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    assignedPlaza: "",
    role: "",
    address: { city: "", state: "", homeAddress: "" },
    phoneNO: "",
  });

  const dispatch = useDispatch();
  const { plazas, status } = useSelector((state) => state.plaza);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPlazas());
    }
  }, [status, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      name in prev.address
        ? { ...prev, address: { ...prev.address, [name]: value } }
        : { ...prev, [name]: value }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    
    dispatch(addSiteEngineer(formData));
    if(status=== 'succeeded') {
      toast.success("Engineer added successfuly")
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="w-full max-w-3xl p-8 bg-white shadow-xl rounded-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Register Site Engineer
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField name="firstName" placeholder="First Name" onChange={handleChange} />
            <InputField name="lastName" placeholder="Last Name" onChange={handleChange} />
            <InputField name="username" placeholder="Username" onChange={handleChange} />
            <InputField type="email" name="email" placeholder="Email" onChange={handleChange} />
            <InputField type="password" name="password" placeholder="Password" onChange={handleChange} />

            {/* Custom Select for Plaza */}
            <CustomSelect
              label="Select Plaza"
              options={plazas?.map(plaza => ({ label: plaza.plazaName, value: plaza._id })) || []}
              selected={plazas?.find(plaza => plaza._id === formData.assignedPlaza)?.plazaName || "Select Plaza"} 
              onChange={(value) => setFormData({ ...formData, assignedPlaza: value })}
            />

            {/* Custom Select for Role */}
            <CustomSelect 
              label="Select Role"
              options={[
                { label: "Plaza Incharge", value: "plaza_incharge" },
                { label: "Site Engineer", value: "site_engineer" }
              ]}
              selected={formData.role || "Select Role"}
              onChange={(value) => setFormData({ ...formData, role: value })}
            />
          </div>

          <h3 className="text-xl font-semibold text-gray-700 mt-6">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <InputField name="city" placeholder="City" onChange={handleChange} />
            <InputField name="state" placeholder="State" onChange={handleChange} />
            <InputField name="homeAddress" placeholder="Home Address" onChange={handleChange} />
          </div>

          <InputField name="phoneNO" value={formData.phoneNO} placeholder="Phone Number" className="mt-4 w-full" onChange={handleChange} />

          <button
            type="submit"
            className="w-full mt-6 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

const InputField = ({ type = "text", name, placeholder, className, onChange }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    onChange={onChange}
    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 ${className}`}
  />
);

export const CustomSelect = ({ label, options = [], selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <div
        className="w-full px-4 py-3 border rounded-lg bg-white shadow-sm cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selected !== "Select Plaza" && selected !== "Select Role" ? "text-gray-800" : "text-gray-400"}>
          {selected}
        </span>
        <span className="ml-2 text-gray-600">▼</span>
      </div>

      {isOpen && (
        <ul className="absolute left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-10">
          {options.length > 0 ? (
            options.map((option, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer transition"
                onClick={() => {
                  onChange(option.value); // Store ObjectId in state
                  setIsOpen(false);
                }}
              >
                {option.label} {/* Show Name */}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No options available</li>
          )}
        </ul>
      )}
       <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
    </div>
  );
};
