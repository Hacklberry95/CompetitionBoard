import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bracketAPI from "../../api/bracketAPI";

export const fetchBracketsByTournamentId = createAsyncThunk(
  "brackets/fetchByTournamentId",
  async (tournamentId) => {
    const brackets = await bracketAPI.getBracketsByTournamentId(tournamentId);
    return brackets;
  }
);

// Create the slice
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
      .addCase(fetchBracketsByTournamentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the actions and reducer
export const { clearBrackets } = bracketSlice.actions;
export default bracketSlice.reducer;
