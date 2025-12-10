import axiosClient from './axiosClient';

const userApi = {
    register: (data) => {
        return axiosClient.post('/users/register', data);
    },
    login: (data) => {
        return axiosClient.post('/users/login', data);
    },
    getAllUsers: () => {
        return axiosClient.get('/users');
    },
    updateUser: (userId, userData) => {
        return axiosClient.put(`/users/${userId}`, userData);
    },
    updateUserRole: (userId, role) => {
        return axiosClient.put(`/users/${userId}/role`, { role });
    },
    deleteUser: (userId) => {
        return axiosClient.delete(`/users/${userId}`);
    }
};

export default userApi;