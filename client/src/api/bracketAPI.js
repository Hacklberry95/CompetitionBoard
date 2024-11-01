import axios from "axios";
const API_URL = "http://localhost:5000/api/brackets";

const bracketAPI = {
  getBracketsByTournamentId: async (tournamentId) => {
    try {
      const response = await axios.get(`${API_URL}/tournament/${tournamentId}`);
      console.log("API response for bracket:", response.data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  getGeneratedBrackets: async (tournamentId) => {
    console.log("BracketAPI tournamentId: ", tournamentId);
    try {
      const response = await axios.post(
        `${API_URL}/${tournamentId}/generateBrackets`
      );
      console.log("REPONSE IN BRACKET API: ", response);
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
  deleteGenerateBrackets: async (tournamentId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${tournamentId}/deleteAll`
      );
      return response;
    } catch (error) {
      return (
        error.response || {
          status: 500,
          data: { error: "Error deleting brackets." },
        }
      );
    }
  },
};

export default bracketAPI;
