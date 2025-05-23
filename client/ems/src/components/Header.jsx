import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import GenerateReport from "./GenerateReport";
import {
  FiSettings,
  FiBell,
  FiUser,
  FiLogOut,
  FiMoreVertical,
  FiX,
} from "react-icons/fi";

function Header() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const logo = "/logo2.png";

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 fixed top-0 text-white px-2 sm:px-6 py-3 shadow-md relative">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo - Responsive sizing */}
        <img
          src={logo}
          alt="Logo"
          className="h-12 sm:h-14 md:h-16 w-auto transition-all duration-300 filter invert brightness-0"
        />

        {/* Mobile Menu Button - Only shows on small screens */}
        <div className="md:hidden ">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-white p-2 rounded-md hover:bg-gray-700 transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMoreVertical size={24} />}
          </button>
        </div>

        {/* Desktop Menu - Shows on medium screens and up */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 z-1">
          <button 
            className="flex items-center gap-1 lg:gap-2 hover:text-yellow-400 transition duration-300 px-2 py-1 rounded"
            aria-label="Settings"
          >
            <FiSettings size={18} className="sm:size-5" />
            <span className="text-sm sm:text-base">Settings</span>
          </button>

          <button 
            className="flex items-center gap-1 lg:gap-2 hover:text-yellow-400 transition duration-300 px-2 py-1 rounded"
            aria-label="Notifications"
          >
            <FiBell size={18} className="sm:size-5" />
            <span className="text-sm sm:text-base">Notifications</span>
          </button> 

          <button 
            className="flex items-center gap-1 lg:gap-2 hover:text-yellow-400 transition duration-300 px-2 py-1 rounded"
            aria-label="Account"
          >
            <FiUser size={18} className="sm:size-5" />
            <span className="text-sm sm:text-base">Account</span>
          </button>

          <button
            onClick={() => dispatch(logout())}
            className="flex items-center gap-1 lg:gap-2 bg-red-600 hover:bg-red-700 px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-lg transition-all duration-300"
            aria-label="Logout"
          >
            <FiLogOut size={18} className="sm:size-5" />
            <span className="text-sm sm:text-base">Logout</span>
          </button>
        </nav>
      </div>

      {/* Mobile Menu Dropdown - Only shows on small screens when toggled */}
      {isOpen && (
        <div className="absolute top-full right-0 z-100 bg-gray-800 text-white shadow-lg rounded-b-lg py-3 px-4 w-full md:hidden">
          <div className="flex flex-col space-y-3">
            <button 
              className="flex items-center gap-3 hover:text-yellow-400 transition duration-300 px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <FiSettings size={20} />
              <span>Settings</span>
            </button>

            <button 
              className="flex items-center gap-3 hover:text-yellow-400 transition duration-300 px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <FiBell size={20} />
              <span>Notifications</span>
            </button>

            <button 
              className="flex items-center gap-3 hover:text-yellow-400 transition duration-300 px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <FiUser size={20} />
              <span>Account</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                dispatch(logout());
              }}
              className="flex items-center gap-3 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md shadow transition-all duration-300"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;