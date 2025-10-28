import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gestao_comercial_auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
