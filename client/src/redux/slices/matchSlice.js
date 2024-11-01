// src/redux/slices/matchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import matchAPI from "../../api/matchAPI";

// Existing action to fetch matches by tournament ID
export const fetchMatchesByTournamentId = createAsyncThunk(
  "matches/fetchByTournamentId",
  async (tournamentId, { rejectWithValue }) => {
    try {
      const response = await matchAPI.getMatchesByTournamentId(tournamentId);
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch matches.");
    }
  }
);

// New action to fetch matches by bracket ID
export const fetchMatchesByBracketId = createAsyncThunk(
  "matches/fetchByBracketId",
  async (bracketId, { rejectWithValue }) => {
    try {
      const response = await matchAPI.getMatchesByBracketId(bracketId);
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch matches by bracket ID.");
    }
  }
);

const matchSlice = createSlice({
  name: "matches",
  initialState: {
    matches: [],
    loading: false,
    error: null,
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
        state.error = action.payload;
      })
      .addCase(fetchMatchesByBracketId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMatchesByBracketId.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatchesByBracketId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default matchSlice.reducer;
