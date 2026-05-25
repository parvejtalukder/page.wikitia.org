import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxios";

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState("user");
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    axiosSecure
      .get(`/users/role`)
      .then((res) => {
        setRole(res.data.role);
        setRoleLoading(false);
      })
      .catch(() => {
        setRoleLoading(false);
      });
  }, [user, axiosSecure]);

  return [role, roleLoading];
};

export default useRole;