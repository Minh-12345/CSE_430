import axiosClient from './axiosClient';

const orderApi = {
    createOrder: (data) => {
        return axiosClient.post('/orders', data);
    },
    getHistory: (userId) => {
        return axiosClient.get(`/orders/user/${userId}`);
    },
    getAllOrders: () => {
        return axiosClient.get('/orders');
    },
    updateOrderStatus: (orderId, status) => {
        return axiosClient.put(`/orders/${orderId}/status`, { status });
    }
};

export default orderApi;