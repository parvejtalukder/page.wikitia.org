import { NavLink, Outlet } from "react-router";
import Wikitia from "../assets/logo.webp";

const LoginBox = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <section className="w-full max-w-4xl p-8 rounded-2xl shadow-md flex flex-col lg:flex-row items-center gap-10 lg:py-20">
        <div className="lg:-ml-10 w-1/2 flex justify-center items-center">
          <img className="hover-3d w-44" src={Wikitia} alt="Wikitia" />
        </div>
        <div className="w-1/2 flex flex-col justify-center items-center lg:mr-10">
        <div className="flex w-[80%] mb-6">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex-1 text-center py-2 font-medium transition ${
                  isActive
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500"
                }`
              }
            >Login</NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `flex-1 text-center py-2 font-medium transition ${
                  isActive
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500"
                }`
              }
            >Register</NavLink>
          </div>
          <Outlet />

        </div>
      </section>
    </div>
  );
};

export default LoginBox;