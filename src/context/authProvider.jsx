// import React, { Children } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
// import { authContext } from './authContext';
// import { auth } from '../../firebase/firebase.init';
import { useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { auth } from '../firebase/firebase.config';
import { useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
import useAxiosSecure from '../hooks/useAxios';
// import useAxiosSecure from '../hooks/useAxios';
// import useAxiosSecure from '../hooks/useAxios';

const googleProvider = new GoogleAuthProvider();
    // const axiosSecure = useAxiosSecure();

const AuthProvider = ({children}) => {

    const queryClient = useQueryClient();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);
    const [roleLoading, setRoleLoading] = useState(false);
    // const axiosSecure = useAxiosSecure();

    const registerUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signInUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password);
    }

    const goWithGoogle = () =>  {
        setLoading(true)
        return signInWithPopup(auth, googleProvider);
    }

    const logOut = async () => {
        setLoading(true);
        await signOut(auth);
        // queryClient.clear();
        queryClient.removeQueries({ queryKey: ["pages"] });
        queryClient.removeQueries({ queryKey: ["payments"] });
        setUser(null);
        setLoading(false);
    }

    const updateUser = (profile) => {
        return updateProfile(auth.currentUser, profile);
    }

    useEffect( () => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            // queryClient.clear();
            setUser(currentUser);
            // queryClient.clear();
            queryClient.refetchQueries();
            setLoading(false);
        });
        return () => {
            unSubscribe();
        }
    }, [])

    useEffect(() => {
      const fetchRole = async () => {
        if (!user) return;
    
        try {
          const token = await user.getIdToken();
        
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
        //   console.log(data);
          setRole(data.role);
          setRoleLoading(false);
        
        } catch (error) {
          console.log(error);
          setRoleLoading(false);
        }
      };
    
      fetchRole();
    }, [user]);

    const AuthInfo = {
        user,
        loading,
        logOut,
        registerUser,
        signInUser,
        goWithGoogle,
        updateUser,
        role,
        roleLoading
    }

    return (
        <AuthContext.Provider value={AuthInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;