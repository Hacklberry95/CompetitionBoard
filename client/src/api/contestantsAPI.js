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

  deleteContestant: async (tournamentId, contestantId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${tournamentId}/${contestantId}` // Correct endpoint to match backend
      );
      return response.data; // Returns the success message
    } catch (error) {
      throw error.response.data; // Throw error message
    }
  },
};
export default contestantsAPI;