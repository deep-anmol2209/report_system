import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getallProjectIncharge } from "../../features/projectInchargeSlice";
import { Search, User, Mail, Phone, Briefcase, ShieldCheck, Users } from "lucide-react";

export default function ManageIncharges() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { incharge, status, error } = useSelector((state) => state.projectIncharge);

  useEffect(() => {
    dispatch(getallProjectIncharge());
  }, [dispatch]);
console.log(incharge);

  const filteredUsers = incharge?.filter((user) =>
    Object.values(user).some((value) =>
      value?.toString()?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-xl rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" /> Manage Project Incharge
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 p-3 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading State */}
        {status === "loading" && (
          <div className="text-center text-gray-500 py-6">Loading users...</div>
        )}

        {/* Error State */}
        {status === "failed" && (
          <div className="text-center text-red-500 py-6">Error: {error}</div>
        )}

        {/* Table */}
        {status === "succeeded" && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse shadow-lg rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                  <th className="p-3 text-left"><User className="inline w-5 h-5 mr-1 text-blue-500" /> First Name</th>
                  <th className="p-3 text-left"><User className="inline w-5 h-5 mr-1 text-blue-500" /> Last Name</th>
                  <th className="p-3 text-left"><Mail className="inline w-5 h-5 mr-1 text-blue-500" /> Email</th>
                  <th className="p-3 text-left"><ShieldCheck className="inline w-5 h-5 mr-1 text-blue-500" /> Username</th>
                  <th className="p-3 text-left"><Briefcase className="inline w-5 h-5 mr-1 text-blue-500" /> Assigned By</th>
                  <th className="p-3 text-left"><Phone className="inline w-5 h-5 mr-1 text-blue-500" /> Phone No</th>
                  <th className="p-3 text-left"><Briefcase className="inline w-5 h-5 mr-1 text-blue-500" /> Assigned Project</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers?.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100 transition-all duration-200">
                     <td className="p-3">{user.firstName || "N/A"}</td>
<td className="p-3">{user.lastName || "N/A"}</td>
<td className="p-3">{user.email || "N/A"}</td>
<td className="p-3">{user.username || "N/A"}</td>
<td className="p-3">{user.assignedBy?.firstName || "N/A"}</td>
<td className="p-3">{user.phoneNO || "N/A"}</td>
<td className="p-3">{user.assignedProject?.projectName || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
