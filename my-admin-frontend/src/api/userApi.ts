// userApi.ts
import axiosInstance from '../api/axiosInstance';

export async function fetchUsers() {
    const res = await axiosInstance.get('/users');
    return res.data;
}
