import axios from 'axios';
import useAuth from './useAuth';
import { useEffect } from 'react';

const server_domain = import.meta.env.VITE_SERVER;

const axiosSecure = axios.create({
    baseURL: server_domain
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