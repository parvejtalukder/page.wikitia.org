import axios from 'axios';
import useAuth from './useAuth';
import { useEffect } from 'react';

const axiosSecure = axios.create({
    baseURL: "http://localhost:3000/"
})

const useAxiosSecure = () => {

    const { user } = useAuth();

    useEffect(() => {
        axiosSecure.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${user?.accessToken}`
            return config;
        })
    } ,[user])

    return axiosSecure;
};

export default useAxiosSecure;