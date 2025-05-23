import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCounts } from "../features/countSlice";
import {
  FaBuilding,
  FaExclamationTriangle,
  FaUsers,
  FaProjectDiagram,
  FaUserTie,
} from "react-icons/fa";

export default function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCounts());
  }, [dispatch]);

  const {
    totalProjects = 0,
    totalPendingIssues = 0,
    totalPlazas = 0,
    totalProjectIncharges = 0,
    totalSiteEngineers = 0,
    status,
    error,
  } = useSelector((state) => state.counts) || {};

  const stats = [
    {
      title: "Total Plazas",
      value: totalPlazas,
      icon: <FaBuilding className="text-blue-500 text-4xl" />,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Pending Issues",
      value: totalPendingIssues,
      icon: <FaExclamationTriangle className="text-red-500 text-4xl" />,
      color: "bg-red-100 text-red-800",
    },
    {
      title: "Total Site Engineers",
      value: totalSiteEngineers,
      icon: <FaUsers className="text-green-500 text-4xl" />,
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Total Projects",
      value: totalProjects,
      icon: <FaProjectDiagram className="text-purple-500 text-4xl" />,
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Total Project Incharge",
      value: totalProjectIncharges,
      icon: <FaUserTie className="text-orange-500 text-4xl" />,
      color: "bg-orange-100 text-orange-800",
    },
  ];

  return (
    <div className="p-6">
      {status === "loading" && <p className="text-center">Loading...</p>}
      {status === "failed" && (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      )}
      {status === "succeeded" && (
        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`relative flex items-center p-6 rounded-2xl shadow-lg ${stat.color} transition transform hover:scale-105 overflow-hidden`}
            >
              <div className="p-4 bg-white rounded-full shadow-md">
                {stat.icon}
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">{stat.title}</h3>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
