import axios from "axios";
const API_URL = "http://localhost:5000/api/brackets";

const bracketAPI = {
  getBracketsByTournamentId: async (tournamentId) => {
    try {
      const response = await axios.get(`${API_URL}/tournament/${tournamentId}`);
      console.log("API response for match:", response.data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default bracketAPI;
