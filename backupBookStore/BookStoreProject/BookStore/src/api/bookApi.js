import axiosClient from './axiosClient';

const bookApi = {
    getAll: () => {
        return axiosClient.get('/books');
    },
    getBestSellers: () => {
        return axiosClient.get('/books/bestseller');
    },
    getFeatured: () => {
        return axiosClient.get('/books/featured');
    },
    search: (query) => {
        return axiosClient.get(`/books/search?q=${query}`);
    },
    get: (id) => {
        return axiosClient.get(`/books/${id}`);
    },
    addBook: (bookData) => {
        return axiosClient.post('/books', bookData);
    },
    updateBook: (bookId, bookData) => {
        return axiosClient.put(`/books/${bookId}`, bookData);
    },
    deleteBook: (bookId) => {
        return axiosClient.delete(`/books/${bookId}`);
    }
};

export default bookApi;