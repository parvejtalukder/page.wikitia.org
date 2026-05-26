// import React from "react";
import { FiPlusCircle, FiEdit2, FiImage, FiBookOpen, FiLogOut, FiEdit3 } from "react-icons/fi";
import { FiHome, FiSettings } from "react-icons/fi";
import { FiCreditCard } from "react-icons/fi";
import { Link, NavLink, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { ImProfile } from "react-icons/im";

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-2 rounded-md transition
   ${isActive ? "bg-base-300 font-medium text-primary" : "hover:bg-base-200"}`;

const AdminDashboard = () => {

    const { logOut, user } = useAuth();

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

    return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT */}
      <div className="drawer-content">
        {/* NAVBAR */}
        <nav className="navbar bg-base-300 w-full">
          <label
            htmlFor="my-drawer-4"
            className="btn btn-square btn-ghost lg:hidden"
          >
            ☰
          </label>

          <Link to={"/dashboard"} className="px-4 text-xl font-bold">Wikitia Dashboard</Link>
        </nav>

        {/* PAGE CONTENT */}
        <div className="p-4">
          <Outlet key={user?.uid} />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

        <aside className="min-h-full w-64 bg-base-200 flex flex-col">

        <ul className="menu w-full grow p-2 space-y-1">
        
          {/* HOME */}
          <li>
            <NavLink to="/" className={linkClass}>
              <FiHome className="text-lg" />
              <span className="ml-2">Home</span>
            </NavLink>
          </li>
        
          {/* WIKI TITLE */}
          <Link to={"/admin"} className="menu-title mt-2">
            <span>Admin Portal</span>
          </Link>
        
          {/* <li>
            <NavLink to="/dashboard/home" className={linkClass}>
              <FiPlusCircle />
              <span className="ml-2">Dashboard</span>
            </NavLink>

          </li> */}
          <li>
            <NavLink to="/admin/create-page-requests" className={linkClass}>
              <FiPlusCircle />
              <span className="ml-2">Create Page Requests</span>
            </NavLink>
          </li>
        
          <li>
            <NavLink to="/dashboard/edit-page" className={linkClass}>
              <FiEdit2 />
              <span className="ml-2">Edit Page</span>
            </NavLink>
          </li>
        
          <li>
            <NavLink to="/dashboard/my-edits" className={linkClass}>
              <FiEdit3 />
              <span className="ml-2">Edit Requests</span>
            </NavLink>
          </li>
        
          {/* <li>
            <NavLink to="/dashboard/add-video" className={linkClass}>
              <FiVideo />
              <span className="ml-2">Add Video</span>
            </NavLink>
          </li> */}
        
          <li>
            <NavLink to="/dashboard/my-pages" className={linkClass}>
              <FiBookOpen />
              <span className="ml-2">Pages Requests</span>
            </NavLink>
          </li>
        
          {/* ACCOUNT */}
          <li className="menu-title mt-4">
            <span>Account</span>
          </li>
        
          <li>
            <NavLink to="/dashboard/payments" className={linkClass}>
              <FiCreditCard />
              <span className="ml-2">Payments</span>
            </NavLink>
          </li>
        
          <li>
            <NavLink to={"/dashboard/profile"} className={linkClass}>
              <ImProfile />
              <span className="ml-2">Profile</span>
            </NavLink>
          </li>
        
          <li>
            <button
              onClick={logOutGo}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-base-200"
            >
              <FiLogOut />
              <span className="ml-2">Log Out</span>
            </button>
          </li>
        
        </ul>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;