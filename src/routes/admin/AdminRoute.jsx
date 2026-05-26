import { Navigate, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import Loader from "../../templates/loader/Loader";

const AdminRoute = ({ children }) => {
  const { user, loading, role, roleLoading } = useAuth();
  const location = useLocation();

  console.log("=== ADMIN ROUTE DEBUG ===");
  console.log("USER:", user);
  console.log("LOADING:", loading);
  console.log("ROLE:", role);
  console.log("ROLE LOADING:", roleLoading);
  console.log("LOCATION:", location.pathname);

  if (loading || roleLoading) {
    console.log("SHOWING LOADER...");
    return <Loader />;
  }

  // Not logged in
  if (!user) {
    console.log("NO USER -> REDIRECT LOGIN");

    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Logged in but not admin
  if (role !== "admin") {
    console.log("NOT ADMIN -> REDIRECT DASHBOARD");

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  console.log("ADMIN ACCESS GRANTED");

  // Is admin - render children
  return children;
};

export default AdminRoute;