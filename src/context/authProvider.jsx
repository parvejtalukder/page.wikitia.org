import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { auth } from "../firebase/firebase.config";
import { useQueryClient } from "@tanstack/react-query";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const goWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = async () => {
    setLoading(true);

    await signOut(auth);

    queryClient.removeQueries({ queryKey: ["pages"] });
    queryClient.removeQueries({ queryKey: ["payments"] });

    setUser(null);
    setRole(null);

    setRoleLoading(false);
    setLoading(false);
  };

  const updateUser = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      if (!currentUser) {
        setRole(null);
        setRoleLoading(false);
        setLoading(false);
        return;
      }
      const fetchRole = async () => {
        try {
          setRoleLoading(true);
          const token = await currentUser.getIdToken();
          const res = await fetch(
            `${import.meta.env.VITE_SERVER}users/role`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await res.json();
          setRole(data.role || "user");
        } catch (error) {
          console.log(error);
          setRole(null);
        } finally {
          setRoleLoading(false);
          setLoading(false);
        }
      };

      fetchRole();
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const AuthInfo = {
    user,
    loading,
    logOut,
    registerUser,
    signInUser,
    goWithGoogle,
    updateUser,
    role,
    roleLoading,
  };

  return (
    <AuthContext.Provider value={AuthInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;