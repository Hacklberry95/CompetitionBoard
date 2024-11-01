// src/redux/slices/bracketSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bracketAPI from "../../api/bracketAPI";

// Async thunk to fetch brackets by tournament ID
export const fetchBracketsByTournamentId = createAsyncThunk(
  "brackets/fetchByTournamentId",
  async (tournamentId) => {
    const response = await bracketAPI.getBracketsByTournamentId(tournamentId);
    return response; // Directly return the data
  }
);

// Async thunk to generate brackets
export const generateBracketsForTournament = createAsyncThunk(
  "brackets/generateForTournament",
  async (tournamentId, { rejectWithValue }) => {
    try {
      const response = await bracketAPI.getGeneratedBrackets(tournamentId);
      return response; // Directly return the success message
    } catch (error) {
      return rejectWithValue("Failed to generate brackets.");
    }
  }
);

// Async thunk to delete all brackets for a tournament
export const deleteAllBrackets = createAsyncThunk(
  "brackets/deleteAll",
  async (tournamentId, { rejectWithValue }) => {
    try {
      const response = await bracketAPI.deleteGenerateBrackets(tournamentId);
      return response; // Directly return the success message
    } catch (error) {
      return rejectWithValue("Failed to delete brackets.");
    }
  }
);

// Bracket slice
const bracketSlice = createSlice({
  name: "brackets",
  initialState: {
    brackets: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBrackets: (state) => {
      state.brackets = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBracketsByTournamentId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBracketsByTournamentId.fulfilled, (state, action) => {
        state.loading = false;
        state.brackets = action.payload;
      })
      .addCase(fetchBracketsByTournamentId.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch brackets.";
      })

      // Generate brackets
      .addCase(generateBracketsForTournament.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateBracketsForTournament.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(generateBracketsForTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete all brackets
      .addCase(deleteAllBrackets.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAllBrackets.fulfilled, (state) => {
        state.loading = false;
        state.brackets = []; // Clear brackets on success
      })
      .addCase(deleteAllBrackets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBrackets } = bracketSlice.actions;
export default bracketSlice.reducer;
