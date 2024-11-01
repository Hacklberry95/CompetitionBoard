import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import matchAPI from "../../api/matchAPI";

// Create async thunks for the API calls
export const fetchMatchesByTournamentId = createAsyncThunk(
  "matches/fetchByTournamentId",
  async (tournamentId) => {
    const matches = await matchAPI.getMatchesByTournamentId(tournamentId);
    return matches;
  }
);

export const createMatch = createAsyncThunk(
  "matches/create",
  async (matchData) => {
    const newMatch = await matchAPI.createMatch(matchData);
    return newMatch;
  }
);

export const updateMatch = createAsyncThunk(
  "matches/update",
  async ({ id, matchData }) => {
    const updatedMatch = await matchAPI.updateMatch(id, matchData);
    return updatedMatch;
  }
);

export const deleteMatch = createAsyncThunk("matches/delete", async (id) => {
  await matchAPI.deleteMatch(id);
  return id;
});

const matchSlice = createSlice({
  name: "matches",
  initialState: {
    matches: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMatches: (state) => {
      state.matches = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatchesByTournamentId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMatchesByTournamentId.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatchesByTournamentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createMatch.fulfilled, (state, action) => {
        state.matches.push(action.payload);
      })
      .addCase(updateMatch.fulfilled, (state, action) => {
        const index = state.matches.findIndex(
          (match) => match.id === action.payload.id
        );
        if (index !== -1) {
          state.matches[index] = action.payload;
        }
      })
      .addCase(deleteMatch.fulfilled, (state, action) => {
        state.matches = state.matches.filter(
          (match) => match.id !== action.payload
        );
      });
  },
});

// Export the actions and reducer
export const { clearMatches } = matchSlice.actions;
export default matchSlice.reducer;
