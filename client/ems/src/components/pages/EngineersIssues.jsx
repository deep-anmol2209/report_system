import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineEye } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import {  getPendingIssuesById, resolveIssue, getIssuesByPlazaId } from "../../features/issueSlice"; // Import resolveIssue action

export default function EngineersIssues() {
  const dispatch = useDispatch();
  const { allIssues: issues = [], status, error } = useSelector((state) => state.issue || {});
  const role = useSelector((state) => state.auth.role);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [remarks, setRemarks] = useState({});

  console.log(role);
  

  useEffect(() => {
    if(role=== "plaza_incharge"){
      dispatch(getIssuesByPlazaId())
    }
    else{
    dispatch(getPendingIssuesById());
    }
  }, [dispatch]);

  // Handle input change for remarks
  const handleRemarkChange = (issueId, value) => {
    setRemarks((prev) => ({ ...prev, [issueId]: value }));
  };

  // Dispatch resolveIssue action
  const handleSubmitRemark = (issueId) => {
    const remarkText = remarks[issueId];
    if (!remarkText) return alert("Please enter a remark before submitting.");

    dispatch(resolveIssue({ issueId, remarks: remarkText }))
     if(status === "succeeded"){
      toast.success("issue resolved successfuly")
     }
     if(status=== "failed"){
      toast.error(error)
     }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Manage Issues</h2>

        {status === "loading" && <p className="text-center text-blue-600">Loading issues...</p>}
        {error && <p className="text-center text-red-600">{error?.msg}</p>}

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Sr No</th>
                <th className="p-3 text-left">Issue ID</th>
                <th className="p-3 text-left">Problem Type</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Plaza Name</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Remarks</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.length > 0 ? (
                issues.filter((issue)=> issue.status=== "Pending").map((issue, index) => (
                  <tr key={issue.issueId} className="border-b hover:bg-gray-100">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{issue?.issueId}</td>
                    <td className="p-3">{issue?.problemType}</td>
                    <td className="p-3">{issue.description ? issue.description.split(" ").slice(0, 3).join(" ") + "..." : "No description"}</td>
                    <td className="p-3">{issue?.plazaId?.plazaName}</td>
                    <td className="p-3">{issue?.status}</td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={remarks[issue.issueId] || ""}
                        onChange={(e) => handleRemarkChange(issue.issueId, e.target.value)}
                        className="border rounded p-2 w-full"
                        placeholder="Enter remarks"
                      />
                      <button
                        onClick={() => handleSubmitRemark(issue.issueId)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mt-2 hover:bg-blue-700"
                      >
                        Submit
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <AiOutlineEye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    No issues found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Details Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 border border-gray-200 relative">
            <h3 className="text-2xl font-semibold mb-3 text-gray-900">Issue Details</h3>
            <p className="text-gray-700"><strong>Issue ID:</strong> {selectedIssue.issueId}</p>
            <p className="text-gray-700"><strong>Issue Type:</strong> {selectedIssue.problemType}</p>
            <p className="text-gray-700"><strong>Description:</strong> {selectedIssue.description}</p>
            <p className="text-gray-700"><strong>Plaza Name:</strong> {selectedIssue.plazaId.plazaName}</p>
            <p className="text-gray-700"><strong>Status:</strong> {selectedIssue.status}</p>
            <p className="text-gray-700"><strong>Issue Time:</strong> {new Date(selectedIssue.issueTime).toLocaleString()}</p>
            <p className="text-gray-700"><strong>Reported By:</strong> {selectedIssue.reportedBy?.username || "Unknown"}</p>
            <button
              onClick={() => setSelectedIssue(null)}
              className="mt-4 bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
    </div>
  );
}
