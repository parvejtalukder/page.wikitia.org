import { Navigate, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import Loader from "../../templates/loader/Loader";

const Private = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={location.pathname}
        replace
      />
    );
  }

  return children;
};

export default Private;