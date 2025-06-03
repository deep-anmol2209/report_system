import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllIssues, getIssuesByProjectId, getIssuesByPlazaId, resetStatus } from "../../../features/issueSlice";
import { updateIssue } from '../../../features/issueSlice';
import { getProjectByInchargeId } from '../../../features/projectSlice';
import { Eye, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';

const statusColors = {
  Pending: 'bg-red-100 text-red-700',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Resolved: 'bg-green-100 text-green-700',
};

const ITEMS_PER_PAGE = 10;

const IssueTable = () => {
  const dispatch = useDispatch();
  const { allIssues, status, error } = useSelector((state) => state.issue);
  const role = useSelector((state) => state.auth?.role);
  const statusOptions = ['Pending', 'Resolved'];
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editIssue, setEditIssue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [formData, setFormData] = useState({
    remarks: '',
    status: '',
    rectifiedTime: '',
  });

  const projectId = useSelector((state) => state.project?.projects?.[0]?._id);

  // Calculate pagination values
  const totalPages = Math.ceil(allIssues.length / ITEMS_PER_PAGE);
  const paginatedIssues = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allIssues.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [allIssues, currentPage]);

  useEffect(() => {
    dispatch(getProjectByInchargeId());
  }, [dispatch]);

  useEffect(() => {
    if (role === "Admin") {
      dispatch(getAllIssues());
    } else if (role === "plaza_incharge") {
      dispatch(getIssuesByPlazaId());
    } else {
      dispatch(getIssuesByProjectId(projectId));
    }
    // Reset to first page when issues change
    setCurrentPage(1);
  }, [dispatch, role, projectId]);

  const handleEditClick = (issue) => {
    setEditIssue(issue);
    setFormData({
      remarks: issue.remarks || '',
      status: issue.status || '',
      rectifiedTime: issue.rectifiedTime
        ? new Date(issue.rectifiedTime).toISOString().slice(0, 16)
        : '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'rectifiedTime' && value) {
      const selectedDate = new Date(value);
      const now = new Date();
      if (selectedDate > now) {
        alert('Rectified time cannot be in the future');
        return;
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.status) {
      alert('Please select a status');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await dispatch(
        updateIssue({
          issueId: editIssue.issueId,
          updates: {
            remarks: formData.remarks,
            status: formData.status,
            rectifiedTime: new Date(formData.rectifiedTime).toISOString(),
          },
        })
      ).unwrap();
      
      setEditIssue(null);
      
      if (role === "Admin") {
        await dispatch(getAllIssues());
      } else if (role === "plaza_incharge") {
        await dispatch(getIssuesByPlazaId());
      } else {
        await dispatch(getIssuesByProjectId(projectId));
      }
      
    } catch (err) {
      console.error('Failed to update issue:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const TableRow = React.memo(({ issue, index, handleEditClick, setSelectedIssue }) => {
    const absoluteIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
    return (
      <tr key={issue.issueId || absoluteIndex} className="border-b hover:bg-gray-50 transition duration-200">
        <td className="px-6 py-4 font-medium text-gray-700">{absoluteIndex + 1}</td>
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
        <td className="px-6 py-4">
          {issue?.rectifiedTime ? new Date(issue.rectifiedTime).toLocaleString() : '—'}
        </td>
        <td className="px-6 py-4">
          {issue.status === "Resolved" && (
            <button
              className="text-indigo-600 hover:text-indigo-800"
              onClick={() => handleEditClick(issue)}
              title="Edit Issue"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
        </td>
      </tr>
    );
  });

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-white min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">🛠️ Issue Tracker</h2>

        {status === 'loading' && (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {typeof error === 'object' ? error.message || 'An error occurred' : error}
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'succeeded' && (
          <>
            <div className="overflow-x-auto border rounded-xl">
              <div className="inline-block min-w-full align-middle">
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
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedIssues.length === 0 ? (
                      <tr>
                        <td colSpan="11" className="px-6 py-4 text-center">
                          <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No issues found</h3>
                            <p className="mt-1 text-gray-500">Get started by reporting a new issue.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedIssues.map((issue, index) => (
                        <TableRow 
                          key={issue.issueId || index}
                          issue={issue}
                          index={index}
                          handleEditClick={handleEditClick}
                          setSelectedIssue={setSelectedIssue}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {allIssues.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * ITEMS_PER_PAGE, allIssues.length)}
                  </span>{' '}
                  of <span className="font-medium">{allIssues.length}</span> issues
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md border ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-md ${currentPage === page ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md border ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Mini Modal for Issue Detail */}
        {selectedIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative transform transition-all duration-300 scale-95 animate-scaleIn">
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

        {/* Edit Issue Modal */}
        {editIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative transform transition-all duration-300 scale-95 animate-scaleIn">
              <button
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
                onClick={() => setEditIssue(null)}
              >
                ✖
              </button>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">✏ Edit Issue</h3>
              <form onSubmit={handleUpdateSubmit} className="space-y-4 text-sm text-gray-700">
                <div>
                  <label className="block mb-1 font-medium">Remarks</label>
                  <input
                    type="text"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2"
                    required
                  >
                    <option value="">Select status</option>
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Rectified DateTime</label>
                  <input
                    type="datetime-local"
                    name="rectifiedTime"
                    value={formData.rectifiedTime}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueTable;