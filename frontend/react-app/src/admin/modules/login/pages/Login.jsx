import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { loginService } from '../services/authService';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);

    const handleLogin = async (email, password) => {
        setLoading(true);
        try {
            const data = await loginService(email, password);
            localStorage.setItem('accessToken', data.accessToken);
            window.location.href = '/admin';
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi đăng nhập");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Đăng nhập hệ thống</h1>
            <LoginForm onSubmit={handleLogin} loading={loading} />
        </div>
    );
};

export default LoginPage;