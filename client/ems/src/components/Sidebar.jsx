import { useState, useEffect } from "react";
import { FaBars, FaChevronDown, FaChevronUp, FaTachometerAlt, FaProjectDiagram, FaUserShield, FaUsers, FaBug, FaHardHat, FaLandmark, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { role, isEngineerAlso } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setOpenMenu(null);
  };

  const toggleSubmenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const roleBasedMenu = {
    SuperAdmin: ["Dashboard", "Projects", "Project Incharge", "Admin", "Issue", "Site Engineers", "Plaza"],
    Admin: ["Dashboard", "Projects", "Admin", "Project Incharge", "Issue", "Site Engineers", "Plaza", "Generate Report", "Admin-Attendance"],
    project_incharge: ["Dashboard", "Projects", "Issue", "Attendance"],
    site_engineer: ["Dashboard", "Issue", "Track Issue", "Attendance"],
    plaza_incharge: ["Dashboard", "Issue", "Plaza Issues"]
  };

  const menuItems = [
    { title: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
    {
      title: "Projects",
      icon: <FaProjectDiagram />,
      subItems: [
        { name: "All Projects", path: "/all-projects" },
        { name: "Add Project", path: "/add-project" },
        { name: "Manage Projects", path: "/manage-projects" },
        { name: "My project", path: "/get-projectById" }
      ].filter(subItem => {
        if (role === "project_incharge") {
          return subItem.name === "My project";
        }
        if (role === "Admin") {
          return subItem.name === "Add Project" || subItem.name === "Manage Projects";
        }
        return false;
      })
    },
    {
      title: "Project Incharge",
      icon: <FaUserShield />,
      subItems: [
        { name: "Add Incharge", path: "/add-incharge" },
        { name: "Manage Incharges", path: "/manage-incharge" },
      ],
    },
    {
      title: "Generate Report",
      icon: <FaUserShield />,
      path: "/generate-report"
    },
    {
      title: "Admin",
      icon: <FaUsers />,
      subItems: [
        { name: "All Admins", path: "/all-admins" },
        { name: "Add Admin", path: "/add-admin" },
        { name: "Manage Admins", path: "/manage-admin" },
      ],
    },
    {
      title: "Issue",
      icon: <FaBug />,
      subItems: [
        { name: "Create Issue", path: "/issue-generate" },
        { name: "Track Issue", path: role === "project_incharge" ? "/manage-ProjectIssues" : "/all-issuesById" },
        { name: "Manage Issue", path: "/manage-issue" },
        { name: "All Issues", path: '/all-issues' },
        { name: "Project Issues", path: '/all-issues' },
        { name: "Plaza Issues", path: "/all-issuesById" }
      ].filter(subItem => {
        if (role === "SuperAdmin" || role === "Admin") {
          return subItem.name === "Manage Issue" || subItem.name === "All Issues";
        }
        if (role === "site_engineer") {
          return subItem.name === "Create Issue" || subItem.name === "Track Issue";
        }
        if (role === "plaza_incharge") {
          return subItem.name === "Plaza Issues" || subItem.name === "Create Issue" || subItem.name === "All Issues";
        }
        if (role === "project_incharge") {
          if (isEngineerAlso === true) {
            return subItem.name === "Create Issue" || subItem.name === "Track Issue" || subItem.name === "Project Issues";
          }
          else {
            return subItem.name === "Project Issues" || subItem.name === "Track Issue";
          }
        }
        return false;
      }),
    },
    {
      title: "Site Engineers",
      icon: <FaHardHat />,
      subItems: [
        { name: "Add Site Engineers", path: "/add-engineer" },
        { name: "All Engineers", path: "/all-engineers" },
        { name: "Manage Engineers", path: "/manage-engineers" },
      ],
    },
    {
      title: "Admin-Attendance",
      icon: <FaHardHat />,
      path: "/adminattendence"
    },
    {
      title: "Attendance",
      icon: <FaHardHat />,
      subItems: [
        { name: "Mark Attendance", path: "/attendence" },
        { name: "Attendance history", path: "/attendancehistory" }
      ],
    },
    {
      title: "Plaza",
      icon: <FaLandmark />,
      subItems: [
        { name: "Add Plaza", path: "/add-plaza" },
        { name: "All Plazas", path: "/all-plazas" },
      ],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => roleBasedMenu[role]?.includes(item.title));

  return (
    <>
      {/* Mobile overlay and toggle */}
      {isMobile && isOpen && (
        <div 
          className="fixed top-0 inset-0  bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      <div className={`fixed top-0 z-40 bg-gray-900 text-white h-full transition-all duration-300
        ${isOpen ? "w-55" : "w-15"} shadow-xl`}>
        
        {/* Header with toggle button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {isOpen && (
            <h2 className="text-xl font-semibold">Menu</h2>
          )}
          <button 
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Menu items */}
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          <ul className="space-y-1 p-2">
            {filteredMenuItems.map((item, index) => (
              <li key={index}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-800 transition-colors
                        ${openMenu === item.title ? 'bg-gray-800' : ''}`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {isOpen && (
                        <>
                          <span className="ml-3 flex-1 text-left">{item.title}</span>
                          {openMenu === item.title ? <FaChevronUp /> : <FaChevronDown />}
                        </>
                      )}
                    </button>

                    {openMenu === item.title && isOpen && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              className="block p-2 pl-6 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white"
                              onClick={() => isMobile && toggleSidebar()}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-800"
                    onClick={() => isMobile && toggleSidebar()}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {isOpen && <span className="ml-3">{item.title}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;