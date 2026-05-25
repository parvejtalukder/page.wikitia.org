// import React from "react";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiBookOpen,
  FiImage,
  FiCreditCard,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import { Link, NavLink, Outlet } from "react-router";
// import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-2 rounded-md transition
   ${
     isActive
       ? "bg-base-300 font-medium text-primary"
       : "hover:bg-base-200"
   }`;

const AdminDashboard = () => {
  const { logOut, user } = useAuth();

  const logOutGo = async () => {
    try {
      await logOut();

      await Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Failed to Log Out",
        text: error.message || "Something went wrong",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT */}
      <div className="drawer-content">
        {/* NAVBAR */}
        <nav className="navbar bg-base-300 w-full">
          <label
            htmlFor="admin-drawer"
            className="btn btn-square btn-ghost lg:hidden"
          >
            ☰
          </label>

          <div className="flex-1 px-4">
            <Link
              to="/admin-dashboard"
              className="text-xl font-bold"
            >
              Wikitia Admin
            </Link>
          </div>

          <div className="pr-4 text-sm opacity-70">
            {user?.email}
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <div className="p-4">
          <Outlet key={user?.uid} />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side">
        <label
          htmlFor="admin-drawer"
          className="drawer-overlay"
        ></label>

        <aside className="min-h-full w-72 bg-base-200 flex flex-col border-r border-base-300">
          <div className="p-4 border-b border-base-300">
            <h2 className="text-xl font-bold">
              Admin Panel
            </h2>

            <p className="text-sm opacity-70 mt-1">
              Manage users, pages, payments & moderation
            </p>
          </div>

          <ul className="menu w-full grow p-3 space-y-1">

            {/* HOME */}
            <li>
              <NavLink to="/" className={linkClass}>
                <FiHome className="text-lg" />
                <span>Home</span>
              </NavLink>
            </li>

            {/* DASHBOARD */}
            <li>
              <NavLink
                to="/admin-dashboard"
                end
                className={linkClass}
              >
                <FiSettings className="text-lg" />
                <span>Admin Overview</span>
              </NavLink>
            </li>

            {/* PAGE MANAGEMENT */}
            <li className="menu-title mt-4">
              <span>Page Management</span>
            </li>

            <li>
              <NavLink
                to="/admin-dashboard/all-pages"
                className={linkClass}
              >
                <FiBookOpen />
                <span>All Pages</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin-dashboard/pending-pages"
                className={linkClass}
              >
                <FiAlertCircle />
                <span>Pending Pages</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin-dashboard/approved-pages"
                className={linkClass}
              >
                <FiCheckCircle />
                <span>Approved Pages</span>
              </NavLink>
            </li>

            {/* <li>
              <NavLink
                to="/admin-dashboard/media-library"
                className={linkClass}
              >
                <FiImage />
                <span>Media Library</span>
              </NavLink>
            </li> */}

            {/* USER MANAGEMENT */}
            <li className="menu-title mt-4">
              <span>User Management</span>
            </li>

            <li>
              <NavLink
                to="/admin-dashboard/manage-users"
                className={linkClass}
              >
                <FiUsers />
                <span>Manage Users</span>
              </NavLink>
            </li>

            {/* PAYMENT */}
            <li className="menu-title mt-4">
              <span>Payments</span>
            </li>

            <li>
              <NavLink
                to="/admin-dashboard/all-payments"
                className={linkClass}
              >
                <FiCreditCard />
                <span>All Payments</span>
              </NavLink>
            </li>

            {/* SETTINGS */}
            <li className="menu-title mt-4">
              <span>System</span>
            </li>

            <li>
              <NavLink
                to="/admin-dashboard/settings"
                className={linkClass}
              >
                <FiSettings />
                <span>Admin Settings</span>
              </NavLink>
            </li>

            {/* LOGOUT */}
            <li className="mt-4">
              <button
                onClick={logOutGo}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-base-300 transition"
              >
                <FiLogOut />
                <span>Log Out</span>
              </button>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;