import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para adicionar o token em todas as requisições
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;