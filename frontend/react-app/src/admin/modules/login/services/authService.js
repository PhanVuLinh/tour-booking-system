import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
                        window.location.href = "/admin/login";
        }
        return Promise.reject(error);
    }
);

export const loginService = async (email, password) => {
    try {
        const response = await apiClient.post('/admin/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi kết nối server" };
    }
};

export const getMeService = async () => {
    try {
        const response = await apiClient.get('/admin/auth/me');
        localStorage.setItem("userId", response.data.id);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi lấy thông tin user" };
    }
};