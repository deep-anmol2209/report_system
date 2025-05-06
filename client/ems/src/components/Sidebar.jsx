import { useState } from "react";
import { FaBars, FaChevronDown, FaChevronUp, FaTachometerAlt, FaProjectDiagram, FaUserShield, FaUsers, FaBug, FaHardHat, FaLandmark , FaTimes} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const { role, isEngineerAlso} = useSelector((state) => state.auth);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setOpenMenu(null);
  };
  const toggleSubmenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };
console.log(role);

  const roleBasedMenu = {
    SuperAdmin: ["Dashboard", "Projects", "Project Incharge", "Admin", "Issue", "Site Engineers", "Plaza"],
    Admin: ["Dashboard", "Projects", "Admin", "Project Incharge", "Issue", "Site Engineers", "Plaza"],
    project_incharge: ["Dashboard", "Projects", "Issue"],
    site_engineer: ["Dashboard", "Issue", "Track Issue"],
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
        {name: "My project", path: "/get-projectById"}
      ].filter(subItem => {
        if (role === "project_incharge" ) {
          return subItem.name === "My project" ;
        }
        if(role === "Admin"){
          return subItem.name === "Add Project" || subItem.name==="Manage Projects"
        }
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
        { name: "Track Issue", path: role=== "project_incharge"?"/manage-ProjectIssues": "/all-issuesById" },
        { name: "Manage Issue", path: "/manage-issue" },
        {name: "All Issues", path: '/all-issues'},
        {name: "Project Issues" , path: '/all-issues'},
        {name: "Plaza Issues", path: "/all-issuesById"}
      ].filter(subItem => {
        if (role === "SuperAdmin" || role === "Admin") {
          return subItem.name === "Manage Issue" || subItem.name=== "All Issues";
        }
        if (role === "site_engineer") {
          return subItem.name === "Create Issue" || subItem.name === "Track Issue";
        }

        if(role=== "plaza_incharge"){
          return subItem.name === "Plaza Issues" || subItem.name=== "Create Issue" || subItem.name=== "All Issues"
        }
        if (role === "project_incharge") {
          if(isEngineerAlso=== true){
            return subItem.name === "Create Issue" || subItem.name === "Track Issue" || subItem.name== "Project Issues" ;
          }
          else{
            return subItem.name === "Project Issues" || subItem.name=== "Track Issue";
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
    <div className="flex">
      <div className={`bg-gradient-to-r from-gray-900 to-gray-800 text-white h-screen p-5 transition-all duration-300 shadow-xl ${isOpen ? "w-72" : "w-20"}`}>
        <button onClick={toggleSidebar} className="text-white focus:outline-none mb-6 flex items-center">
          <FaBars size={28} className="mr-2" />
          {isOpen && <span className="text-lg font-semibold">Menu</span>}
        </button>

        <ul className="space-y-3">
          {filteredMenuItems.map((item, index) => (
            <li key={index} className="group">
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className="flex items-center justify-between w-full px-4 py-3 text-left bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-300 shadow-md"
                  >
                    <span className="flex items-center">
                      {item.icon} {isOpen && <span className="ml-3 text-base font-medium">{item.title}</span>}
                    </span>
                    {isOpen && (openMenu === item.title ? <FaChevronUp /> : <FaChevronDown />)}
                  </button>

                  {openMenu === item.title && (
                    <ul className="pl-6 mt-2 space-y-2 border-l-2 border-gray-500 ml-4">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex} className="bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition duration-300">
                          <Link to={subItem.path} className="text-sm text-gray-300 hover:text-white block">
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
                  className="flex items-center px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-300 shadow-md"
                >
                  {item.icon}{isOpen && <span className="ml-3">{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  };

export default Sidebar;
