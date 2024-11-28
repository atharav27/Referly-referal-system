import axios from 'axios';

const API_BASE_URL =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_URL // Use the full backend URL in production
    : '/api'; // Proxy in development

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export default axiosInstance;
