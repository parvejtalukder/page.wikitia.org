// import React, { Children } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
// import { authContext } from './authContext';
// import { auth } from '../../firebase/firebase.init';
import { useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { auth } from '../firebase/firebase.config';
import { useQueryClient } from '@tanstack/react-query';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {

    const queryClient = useQueryClient();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
            setLoading(false);
        });
        return () => {
            unSubscribe();
        }
    }, [])

    const AuthInfo = {
        user,
        loading,
        logOut,
        registerUser,
        signInUser,
        goWithGoogle,
        updateUser
    }

    return (
        <AuthContext.Provider value={AuthInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;