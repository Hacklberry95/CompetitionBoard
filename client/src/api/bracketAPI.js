import axios from "axios";

const API_URL = "http://localhost:5000/api/brackets";

const bracketAPI = {
  getBracketsByTournamentId: async (tournamentId) => {
    try {
      const response = await axios.get(`${API_URL}/tournament/${tournamentId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch brackets."
      );
    }
  },

  getGeneratedBrackets: async (tournamentId) => {
    try {
      const response = await axios.post(
        `${API_URL}/${tournamentId}/generateBrackets`
      );
      return {
        message: "Brackets generated successfully!",
        data: response.data,
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error generating brackets."
      );
    }
  },

  deleteGenerateBrackets: async (tournamentId) => {
    console.log("DELETING WITH TOURNAMENT ID: ", tournamentId);
    try {
      const response = await axios.delete(
        `${API_URL}/${tournamentId}/deleteAll`
      );
      return { message: "Brackets deleted successfully!", data: response.data };
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error deleting brackets."
      );
    }
  },
};

export default bracketAPI;
