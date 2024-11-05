import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import matchAPI from "../../api/matchAPI";

export const declareWinner = createAsyncThunk(
  "matches/declareWinner",
  async (
    { matchId, winnerId, loserId, isLosersBracket, bracketId, roundNumber },
    { rejectWithValue }
  ) => {
    try {
      const response = await matchAPI.declareWinner({
        matchId,
        winnerId,
        loserId,
        isLosersBracket,
        bracketId,
        roundNumber,
      });
      return response;
    } catch (error) {
      return rejectWithValue("Failed to declare a winner.");
    }
  }
);

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
    loadingUpdate: false, // New loading state specifically for updates
    error: null,
  },
  reducers: {
    clearMatches: (state) => {
      state.matches = []; // Clear matches state
    },
  },
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(declareWinner.pending, (state) => {
        state.loadingUpdate = true;
      })
      .addCase(declareWinner.fulfilled, (state, action) => {
        state.loadingUpdate = false;
      })
      .addCase(declareWinner.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.error = action.payload;
      });
  },
});

export const { clearMatches } = matchSlice.actions;
export default matchSlice.reducer;
