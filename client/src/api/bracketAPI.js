import axios from 'axios';

const API_URL = 'http://localhost:5000/api/brackets';

const bracketAPI = {
    createBracket: async (bracketData) => {
        try {
            const response = await axios.post(API_URL, bracketData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    getBracketByTournamentId: async (tournamentId) => {
        try {
            const response = await axios.get(`${API_URL}/${tournamentId}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    updateBracket: async (id, bracketData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, bracketData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    deleteBracket: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
};

export default bracketAPI;
