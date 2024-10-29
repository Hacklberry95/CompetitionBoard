// src/api/contestantsAPI.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/contestants"; // Adjust if necessary

const contestantsAPI = {
  getContestantsByTournamentId: async (tournamentId) => {
    try {
      const response = await axios.get(`${API_URL}/tournament/${tournamentId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getContestantById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      console.log("getContestantById: ", response.data);
      return response.data;
    } catch (error) {
      throw error.response.data; // Handle error appropriately
    }
  },

  deleteContestant: async (tournamentId, contestantId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${tournamentId}/${contestantId}`
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};
export default contestantsAPI;
