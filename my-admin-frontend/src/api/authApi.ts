// src/api/authApi.ts
import axiosInstance from './axiosInstance';

export async function login(username: string, password: string): Promise<{ access_token: string; role: string } | null> {
    try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await axiosInstance.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.data && response.data.access_token) {
            // Сохраняем токен и роль в localStorage для последующего использования
            localStorage.setItem('access_token', response.data.access_token);
            if (response.data.role) {
                localStorage.setItem('role', response.data.role);
            }
            return { access_token: response.data.access_token, role: response.data.role };
        }
        return null;
    } catch (error) {
        console.error('Login error', error);
        return null;
    }
}

export async function fetchUsers() {
    // Токен уже будет добавлен интерцептором в axiosInstance
    const res = await axiosInstance.get('/users');
    return res.data;
}
