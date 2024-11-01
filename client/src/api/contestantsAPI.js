// src/api/contestantsAPI.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/contestants"; // Adjust if necessary

const contestantsAPI = {
  getContestantsByTournamentId: async (tournamentId) => {
    try {
      const response = await axios.get(`${API_URL}/tournament/${tournamentId}`);
      console.log("CONTESTANTS FROM API: ", response.data);
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

  addContestantToTournament: async (tournamentId, contestantData) => {
    console.log("Contestant Data being sent:", contestantData);
    try {
      const response = await axios.post(
        `${API_URL}/${tournamentId}/contestants`,
        contestantData
      );
      console.log("API Call response for adding contestant", response);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  deleteContestantFromTournament: async (tournamentId, contestantId) => {
    console.log("DELETE CONTESTANT: ", tournamentId, " ", contestantId);
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
