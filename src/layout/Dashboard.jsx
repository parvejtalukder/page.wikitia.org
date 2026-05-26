// import React from "react";
import { useState } from "react";
import { FiPlusCircle, FiEdit2, FiBookOpen, FiLogOut, FiEdit3 } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FiCreditCard } from "react-icons/fi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link, NavLink, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { ImProfile } from "react-icons/im";

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-2 rounded-md transition whitespace-nowrap
   ${isActive ? "bg-base-300 font-medium text-primary" : "hover:bg-base-200"}`;

const Dashboard = () => {
    const { logOut, user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const logOutGo = async () => {
      try {
        await logOut();

        await Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been logged out successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
        // window.location.reload();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Failed to Log Out',
          text: error.message || 'Something went wrong',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    };

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT */}
      <div className="drawer-content">
        {/* NAVBAR */}
        <nav className="navbar bg-base-300 w-full">
          <div className="flex items-center gap-2">
            {/* Toggle button for mobile */}
            <label
              htmlFor="my-drawer-4"
              className="btn btn-square btn-ghost lg:hidden"
            >
              ☰
            </label>
            
            {/* Toggle button for desktop */}
            <button
              onClick={toggleSidebar}
              className="btn btn-square btn-ghost hidden lg:flex"
              title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
            </button>
            
            <Link to={"/dashboard"} className="px-4 text-xl font-bold">Wikitia Dashboard</Link>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <div className="p-4">
          <Outlet key={user?.uid} />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

        <aside 
          className={`min-h-full bg-base-200 flex flex-col transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'w-64' : 'w-16'}`}
          style={{ overflow: 'hidden' }}
        >
          <ul className={`menu w-full grow p-2 space-y-1 ${!isSidebarOpen && 'items-center'}`}>
            {/* HOME */}
            <li className="w-full">
              <NavLink to="/" className={`${linkClass({ isActive: false })} ${!isSidebarOpen && 'justify-center px-0'}`}>
                <FiHome className="text-lg flex-shrink-0" />
                {isSidebarOpen && <span className="ml-2">Home</span>}
              </NavLink>
            </li>
          
            {/* WIKI TITLE */}
            {isSidebarOpen && (
              <Link to={"/dashboard"} className="menu-title mt-2">
                <span>Wiki Management</span>
              </Link>
            )}
            
            {!isSidebarOpen && <div className="divider my-2"></div>}
          
            <li className="w-full">
              <NavLink to="/dashboard/create-page" className={`${linkClass({ isActive: false })} ${!isSidebarOpen && 'justify-center px-0'}`}>
                <FiPlusCircle className="flex-shrink-0" />
                {isSidebarOpen && <span className="ml-2">Create Page</span>}
              </NavLink>
            </li>
          
            <li className="w-full">
              <NavLink to="/dashboard/edit-page" className={`${linkClass({ isActive: false })} ${!isSidebarOpen && 'justify-center px-0'}`}>
                <FiEdit2 className="flex-shrink-0" />
                {isSidebarOpen && <span className="ml-2">Edit Page</span>}
              </NavLink>
            </li>
          
            <li className="w-full">
              <NavLink to="/dashboard/my-edits" className={`${linkClass({ isActive: false })} ${!isSidebarOpen && 'justify-center px-0'}`}>
                <FiEdit3 className="flex-shrink-0" />
                {isSidebarOpen && <span className="ml-2">Edit Requests</span>}
              </NavLink>
            </li>
          
            <li className="w-full">
              <NavLink to="/dashboard/my-pages" className={`${linkClass({ isActive: false })} ${!isSidebarOpen && 'justify-center px-0'}`}>
                <FiBookOpen className="flex-shrink-0" />
                {isSidebarOpen && <span className="ml-2">Pages Requests</span>}
              </NavLink>
            </li>
          
            {/* ACCOUNT */}
            {isSidebarOpen && (
              <li className="menu-title mt-4">
                <span>Account</span>
              </li>
            )}
            
            {!isSidebarOpen && <div className="divider my-2"></div>}
          
            <li className="w-full">
              <NavLink to="/dashboard/payments" className={`${linkClass({ isActive: false })} ${!isSidebarOpen && 'justify-center px-0'}`}>
                <FiCreditCard className="flex-shrink-0" />
                {isSidebarOpen && <span className="ml-2">Payments</span>}
              </NavLink>
            </li>
          
            <li className="w-full">
              <NavLink to={"/dashboard/profile"} className={`${linkClass({ isActive: false })} ${!isSidebarOpen && 'justify-center px-0'}`}>
                <ImProfile className="flex-shrink-0" />
                {isSidebarOpen && <span className="ml-2">Profile</span>}
              </NavLink>
            </li>
          
            <li className="w-full">
              <button
                onClick={logOutGo}
                className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-base-200 w-full
                  ${!isSidebarOpen && 'justify-center px-0'}`}
              >
                <FiLogOut className="flex-shrink-0" />
                {isSidebarOpen && <span className="ml-2">Log Out</span>}
              </button>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;