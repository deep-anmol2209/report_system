import { useState , useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { addIssue, getPendingIssuesById } from "../../features/issueSlice.js";
import { CustomSelect } from "./Admin/AddSiteEngineer.jsx";
import { getProjectByInchargeId } from "../../features/projectSlice"; 
import "react-toastify/dist/ReactToastify.css";

const IssueGeneration = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const { projects, status: projectStatus, error } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(getProjectByInchargeId());
  }, [dispatch])

  
  const projectId= useSelector((state)=> state.project.projects[0])
  const isEngineerAlso= useSelector((state)=> state.auth.isEngineerAlso)


  

  const [formData, setFormData] = useState({
    problemType: "",
    description: "",
    timeOfIssue: "",
    plazaId: ""
  });

 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted Issue:", formData);
    
    try {
      const result = await dispatch(addIssue(formData)).unwrap();
     
      toast.success("Issue created successfully!", { position: "top-right" });
      setFormData({
        problemType: "",
        description: "",
        timeOfIssue: "",
        plazaId: ""
      }

      )

      dispatch(getPendingIssuesById())
      
     
    } catch (error) {
      toast.error("Failed to create issue!", { position: "top-right" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Generate New Issue</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Issue Type Selection */}
          <select name="problemType" className={inputField} value={formData.problemType} onChange={handleChange} required>
            <option value="">Select Issue Type</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
          </select>

          {/* Issue Description */}
          <textarea
            name="description"
            value={formData.description}
            className={inputField}
            placeholder="Issue Description"
            onChange={handleChange}
            required
          ></textarea>

{ isEngineerAlso && <CustomSelect
              label="Select Plaza"
              options={projectId?.plazas?.map(plaza => ({ label: plaza.plazaName, value: plaza._id })) || []}
              selected={projectId?.plazas?.find(plaza => plaza._id === formData.plazaId)?.plazaName || "Select Plaza"} 
              onChange={(value) => setFormData({ ...formData, plazaId: value })}
            />}

          {/* Time of Issue */}
          <input type="datetime-local" name="timeOfIssue" className={inputField} value={formData.timeOfIssue} onChange={handleChange} />

          {/* Submit Button */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            Submit Issue
          </button>
        </form>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default IssueGeneration;

// Tailwind Input Field Styling
const inputField = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400";
