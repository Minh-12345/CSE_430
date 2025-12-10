import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://10.70.162.38:5142/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

axiosClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            alert('Request timeout');
        } else if (error.response) {
            alert(`Error: ${error.response.data?.message || 'Something went wrong'}`);
        } else {
            alert('Network error');
        }
        return Promise.reject(error);
    }
);

export default axiosClient;