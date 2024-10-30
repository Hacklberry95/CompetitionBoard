import axios from "axios";

const API_URL = "http://localhost:5000/api/tournaments";

const tournamentAPI = {
  createTournament: async (tournamentData) => {
    try {
      const response = await axios.post(API_URL, tournamentData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  getAllTournaments: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  getTournamentById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  updateTournament: async (id, tournamentData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, tournamentData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  deleteTournament: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  addContestantToTournament: async (tournamentId, contestantData) => {
    try {
      const response = await axios.post(
        `${API_URL}/${tournamentId}/contestants`,
        contestantData
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  getGeneratedBrackets: async (tournamentId) => {
    try {
      const response = await axios.post(
        `${API_URL}/${tournamentId}/generateBrackets`
      );
      return response;
    } catch (error) {
      return (
        error.response || {
          status: 500,
          data: { error: "Error generating brackets." },
        }
      );
    }
  },
};

export default tournamentAPI;
