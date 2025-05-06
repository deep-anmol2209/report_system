import { useEffect, useState } from "react";

import { getallAdmins } from "../../features/adminSlice";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SiteEngineers = () => {
  
  const employees = [
    { firstName: "John", lastName: "Doe", email: "john@example.com", username: "john123", projectWorking: "Project A", plazaName: "Plaza 1" },
    { firstName: "Jane", lastName: "Smith", email: "jane@example.com", username: "jane_smith", projectWorking: "Project B", plazaName: "Plaza 2" },
    { firstName: "Michael", lastName: "Johnson", email: "michael@example.com", username: "mike_john", projectWorking: "Project C", plazaName: "Plaza 3" },
    // Add more sample employees as needed
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;
  const totalPages = Math.ceil(employees.length / employeesPerPage);

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 border-b pb-3">Site Engineers</h1>
      
      {/* Employee Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full border-collapse bg-gray-50">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <th className="py-3 px-5 text-left">First Name</th>
              <th className="py-3 px-5 text-left">Last Name</th>
              <th className="py-3 px-5 text-left">Email</th>
              <th className="py-3 px-5 text-left">Username</th>
              <th className="py-3 px-5 text-left">Project Working</th>
              <th className="py-3 px-5 text-left">Plaza Name</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((employee, index) => (
              <tr key={index} className="border-b hover:bg-gray-100 transition">
                <td className="py-3 px-5">{employee.firstName}</td>
                <td className="py-3 px-5">{employee.lastName}</td>
                <td className="py-3 px-5">{employee.email}</td>
                <td className="py-3 px-5">{employee.username}</td>
                <td className="py-3 px-5">{employee.projectWorking}</td>
                <td className="py-3 px-5">{employee.plazaName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-3">
        <button
          className={`p-2 rounded-full ${currentPage === 1 ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <FaChevronLeft />
        </button>
        <span className="px-4 py-2 bg-gray-200 rounded-md text-gray-700">{currentPage} / {totalPages}</span>
        <button
          className={`p-2 rounded-full ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default SiteEngineers;
