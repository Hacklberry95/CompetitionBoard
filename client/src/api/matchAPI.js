import axios from 'axios';

const API_URL = 'http://localhost:5000/api/matches';

const matchAPI = {
    createMatch: async (matchData) => {
        try {
            const response = await axios.post(API_URL, matchData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    getMatchesByTournamentId: async (tournamentId) => {
        try {
            const response = await axios.get(`${API_URL}/${tournamentId}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    updateMatch: async (id, matchData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, matchData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    deleteMatch: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
};

export default matchAPI;
