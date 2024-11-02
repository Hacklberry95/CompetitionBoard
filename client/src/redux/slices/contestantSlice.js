// src/redux/slices/contestantSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import contestantsAPI from "../../api/contestantsAPI";

// Initial State
const initialState = {
  contestants: [],
  contestantsMap: {},
  selectedContestant: null,
  loading: false,
  error: null,
};

// Async thunk to fetch contestants by tournament ID
export const fetchContestantsByTournamentId = createAsyncThunk(
  "contestants/fetchByTournamentId",
  async (tournamentId) => {
    const contestants = await contestantsAPI.getContestantsByTournamentId(
      tournamentId
    );
    console.log("ContestantSlice response: ", contestants);
    return contestants;
  }
);

// Async thunk to fetch contestants for matches
export const fetchContestantsForMatches = createAsyncThunk(
  "contestants/fetchForMatches",
  async (participantIds, { rejectWithValue }) => {
    try {
      const uniqueIds = [...new Set(participantIds)];
      const contestants = await Promise.all(
        uniqueIds.map((id) => contestantsAPI.getContestantById(id))
      );

      const contestantsMap = contestants.reduce((acc, contestant) => {
        acc[contestant.id] = contestant.Name;
        return acc;
      }, {});

      return contestantsMap;
    } catch (error) {
      return rejectWithValue("Failed to fetch contestants.");
    }
  }
);

// Async thunk to delete a contestant
export const deleteContestantFromTournament = createAsyncThunk(
  "contestants/delete",
  async ({ tournamentId, contestantId }) => {
    await contestantsAPI.deleteContestantFromTournament(
      tournamentId,
      contestantId
    );
    return contestantId;
  }
);

// Async thunk to add a contestant to a tournament
export const addContestantToTournament = createAsyncThunk(
  "contestants/add",
  async ({ tournamentId, contestantData }) => {
    const newContestant = await contestantsAPI.addContestantToTournament(
      tournamentId,
      contestantData
    );
    return newContestant;
  }
);

// Contestant Slice
const contestantSlice = createSlice({
  name: "contestants",
  initialState,
  reducers: {
    resetContestants: (state) => {
      state.contestants = [];
      state.selectedContestant = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContestantsByTournamentId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContestantsByTournamentId.fulfilled, (state, action) => {
        state.loading = false;
        state.contestants = action.payload;
      })
      .addCase(fetchContestantsByTournamentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchContestantsForMatches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContestantsForMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.contestantsMap = action.payload;
      })
      .addCase(fetchContestantsForMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addContestantToTournament.fulfilled, (state, action) => {
        state.contestants.push(action.payload);
      })
      .addCase(deleteContestantFromTournament.fulfilled, (state, action) => {
        state.contestants = state.contestants.filter(
          (contestant) => contestant.id !== action.payload
        );
      });
  },
});

// Export actions, selectors, and reducer
export const { resetContestants } = contestantSlice.actions;
export const selectContestants = (state) => state.contestants.contestants;
export const selectLoading = (state) => state.contestants.loading;
export const selectError = (state) => state.contestants.error;
export default contestantSlice.reducer;
