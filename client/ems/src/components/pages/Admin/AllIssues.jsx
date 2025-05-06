import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllIssues, getIssuesByProjectId, getIssuesByPlazaId } from "../../../features/issueSlice";
import { getProjectByInchargeId } from '../../../features/projectSlice';
import { Eye } from 'lucide-react'; // npm install lucide-react

const statusColors = {
  Pending: 'bg-red-100 text-red-700',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Resolved: 'bg-green-100 text-green-700',
};

const IssueTable = () => {
  const dispatch = useDispatch();
  const { allIssues, status, error } = useSelector((state) => state.issue);
  const role= useSelector((state)=> state.auth?.role)

  const [selectedIssue, setSelectedIssue] = useState(null);
  useEffect(() => {
    dispatch(getProjectByInchargeId());
  }, [dispatch]);
  
  const projectId = useSelector((state) => state.project?.projects?.[0]?._id); // safer access
  
  useEffect(() => {
    if (role === "Admin") {
      dispatch(getAllIssues());

    } 
    else if(role==="plaza_incharge"){
      dispatch(getIssuesByPlazaId())
     
    }else {
      dispatch(getIssuesByProjectId(projectId));
    }
  }, [dispatch, role, projectId]); // include role and projectId as dependencies
  

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-white min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">🛠️ Issue Tracker</h2>

        {status === 'loading' && <p className="text-center text-gray-600 py-6">Loading issues...</p>}
        {status === 'failed' && (
  <p className="text-center text-red-500 py-6">
    {typeof error === 'object' && error?.message ? error.message : error || 'Failed to load issues.'}
  </p>
)}


        {status === 'succeeded' && (
          <div className="overflow-x-auto border rounded-xl">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Sr No</th>
                  <th className="px-6 py-4">Issue ID</th>
                  <th className="px-6 py-4">Problem Type</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Plaza Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Reported By</th>
                  <th className="px-6 py-4">Remarks</th>
                  <th className="px-6 py-4">Rectified By</th>
                  <th className="px-6 py-4">Rectified DateTime</th>
                </tr>
              </thead>
              <tbody>
                {allIssues.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                      No issues found.
                    </td>
                  </tr>
                ) : (
                  allIssues.map((issue, index) => (
                    <tr key={issue.issueId || index} className="border-b hover:bg-gray-50 transition duration-200">
                      <td className="px-6 py-4 font-medium text-gray-700">{index + 1}</td>
                      <td className="px-6 py-4">{issue?.issueId}</td>
                      <td className="px-6 py-4">{issue?.problemType}</td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <span>{issue?.description?.split(" ")[0]}...</span>
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => setSelectedIssue(issue)}
                          title="View full details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                      <td className="px-6 py-4">{issue?.plazaId?.plazaName}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            statusColors[issue?.status] || 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {issue?.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{issue?.reportedBy?.username}</td>
                      <td className="px-6 py-4">
                      <span>{issue?.remarks?.split(" ")[0]}...</span>
                      </td>
                      <td className="px-6 py-4">{issue?.rectifiedBy?.firstName || '—'}</td>
                      <td className="px-6 py-4"> {issue?.rectifiedTime ? new Date(issue.rectifiedTime).toLocaleString() : '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Mini Modal for Issue Detail */}
        {selectedIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
              <button
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedIssue(null)}
              >
                ✖
              </button>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">📝 Issue Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium text-gray-800">Issue ID:</span> {selectedIssue.issueId}</p>
                <p><span className="font-medium text-gray-800">Problem Type:</span> {selectedIssue.problemType}</p>
                <p><span className="font-medium text-gray-800">Description:</span> {selectedIssue.description}</p>
                <p><span className="font-medium text-gray-800">Plaza:</span> {selectedIssue?.plazaId?.plazaName}</p>
                <p><span className="font-medium text-gray-800">Status:</span> {selectedIssue.status}</p>
                <p><span className="font-medium text-gray-800">Reported By:</span> {selectedIssue.reportedBy.username}</p>
                <p><span className="font-medium text-gray-800">Remarks:</span> {selectedIssue.remarks || '—'}</p>
                <p><span className="font-medium text-gray-800">Rectified By:</span> {selectedIssue?.rectifiedBy?.firstName || '—'}</p>
                <p><span className="font-medium text-gray-800">Rectified DateTime:</span> {selectedIssue?.rectifiedTime ? new Date(selectedIssue.rectifiedTime).toLocaleString() : '—'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueTable;
