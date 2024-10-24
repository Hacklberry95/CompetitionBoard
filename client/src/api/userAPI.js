import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const userAPI = {
    createUser: async (userData) => {
        try {
            const response = await axios.post(API_URL, userData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    getAllUsers: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    getUserById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    updateUser: async (id, userData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, userData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    deleteUser: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
};

export default userAPI;
