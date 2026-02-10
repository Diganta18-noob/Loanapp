import axios from 'axios';
import { toast } from 'react-toastify';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Attach token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Intercept 401 responses → clear auth and redirect to login
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            toast.error(error.response.data?.message || 'Session expired – please log in again');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;
