import React, { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import { LoginContext } from './Context/LoginContext';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoggedIn } = useContext(LoginContext);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      {isLoggedIn && (
        <div className="fixed top-0 left-0 right-0 z-10 w-full bg-white shadow-md">
          <Navbar onSidebarToggle={toggleSidebar} />
        </div>
      )}
      <div className="flex mt-16 w-full">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="w-1/8 min-w-max">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          </div>
        )}
        
        {/* Content Area (Home or other pages inside Outlet) */}
        <div
          className={`transition-all duration-300 ease-in-out flex-grow ${
            isSidebarOpen ? "ml-1/8 w-7/8" : "w-full"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
