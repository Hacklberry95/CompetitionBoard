import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bracketAPI from "../../api/bracketAPI";

// Async thunk to fetch brackets by tournament ID
export const fetchBracketsByTournamentId = createAsyncThunk(
  "brackets/fetchByTournamentId",
  async (tournamentId) => {
    return await bracketAPI.getBracketsByTournamentId(tournamentId);
  }
);

// Async thunk to generate brackets
export const generateBracketsForTournament = createAsyncThunk(
  "brackets/generateForTournament",
  async (tournamentId, { rejectWithValue }) => {
    try {
      return await bracketAPI.getGeneratedBrackets(tournamentId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete all brackets
export const deleteAllBrackets = createAsyncThunk(
  "brackets/deleteAll",
  async (tournamentId, { rejectWithValue }) => {
    try {
      return await bracketAPI.deleteGenerateBrackets(tournamentId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Bracket slice
const bracketSlice = createSlice({
  name: "brackets",
  initialState: {
    brackets: [],
    selectedBracket: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearBrackets: (state) => {
      state.brackets = [];
    },
    setSelectedBracket: (state, action) => {
      state.selectedBracket = action.payload;
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
        state.error = null;
      })
      .addCase(fetchBracketsByTournamentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Show the error message from the action
      })
      // Generate brackets
      .addCase(generateBracketsForTournament.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateBracketsForTournament.fulfilled, (state, action) => {
        state.loading = false;
        state.brackets = action.payload.data; // Assuming the data structure is as needed
        state.error = null;
      })
      .addCase(generateBracketsForTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Show the error message from the action
      })
      // Delete all brackets
      .addCase(deleteAllBrackets.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAllBrackets.fulfilled, (state, action) => {
        state.loading = false;
        state.brackets = [];
        state.error = null;
      })
      .addCase(deleteAllBrackets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Show the error message from the action
      });
  },
});

export const { clearBrackets, setSelectedBracket } = bracketSlice.actions;
export default bracketSlice.reducer;
