import axios from 'axios';
import useAuth from './useAuth';

const server_domain = import.meta.env.VITE_SERVER;

const useAxiosSecure = () => {
    const { user } = useAuth();

    const axiosSecure = axios.create({
        baseURL: server_domain,
    });

    // Add interceptor every time (simple and works)
    axiosSecure.interceptors.request.use(
        async (config) => {
            if (user?.uid) {
                const token = await user.getIdToken(true);
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }
    );

    return axiosSecure;
};

export default useAxiosSecure;