import Header from "../Header";
import Sidebar from "../Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";



const Layout = () => {
    const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      {/* Sidebar - hidden on mobile, shown on sm and above */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className={`flex-1 transition-all duration-300 ease-in-out ${isOpen ? 'ml-[100px]' : 'ml-[72px]'}`}>
          <div className=" w-full max-w-full overflow-hidden sm:max-w-6xl mx-auto ">
            <Outlet className="p-4"/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout