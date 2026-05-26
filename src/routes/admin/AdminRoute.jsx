import { Navigate, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import Loader from "../../templates/loader/Loader";

const AdminRoute = ({ children }) => {
  const { user, loading, role, roleLoading } = useAuth();
  const location = useLocation();

  if (loading || roleLoading) {
    return <Loader />;
  }

  // Not logged in
  if (!user) {
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
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }
  // Is admin - render children
  return children;
};

export default AdminRoute;