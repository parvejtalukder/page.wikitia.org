import { Navigate } from "react-router";

const RedirectToEdits = () => {
  return <Navigate to="/dashboard/edit-page" replace />;
};

export default RedirectToEdits;