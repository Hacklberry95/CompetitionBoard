// src/redux/slices/contestantSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import contestantsAPI from "../../api/contestantsAPI";

const initialState = {
  contestants: [],
  selectedContestant: null,
  loading: false,
  error: null,
};

// Async thunk to fetch contestants by tournament ID
export const fetchContestantsByTournamentId = createAsyncThunk(
  "contestants/fetchByTournamentId",
  async (tournamentId) => {
    const contestants = await contestantsAPI.getContestantsByTournamentId(
      tournamentId.id
    );
    return contestants;
  }
);

// Async thunk to fetch a contestant by ID
export const fetchContestantById = createAsyncThunk(
  "contestants/fetchById",
  async (id) => {
    const contestant = await contestantsAPI.getContestantById(id);
    return contestant;
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
    return contestantId; // Return the contestantId to handle the state update
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
    console.log("Contestant returned: ", newContestant.data);
    return newContestant.data; // Return the newly added contestant
  }
);

// Create the slice
const contestantSlice = createSlice({
  name: "contestants",
  initialState,
  reducers: {
    resetContestants: (state) => {
      state.contestants = [];
      state.selectedContestant = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContestantsByTournamentId.fulfilled, (state, action) => {
        state.loading = false;
        state.contestants = action.payload;
      })
      .addCase(fetchContestantById.fulfilled, (state, action) => {
        state.selectedContestant = action.payload;
      })
      .addCase(deleteContestantFromTournament.fulfilled, (state, action) => {
        state.contestants = state.contestants.filter(
          (contestant) => contestant.id !== action.payload
        );
      })
      .addCase(addContestantToTournament.fulfilled, (state, action) => {
        // Add the new contestant to the contestants array
        state.contestants.push(action.payload);
        console.log(
          "Updated contestants in slice: ",
          JSON.stringify(state.contestants)
        ); // Log updated state
      })
      .addCase(addContestantToTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error if needed
      });
  },
});

// Export actions and reducer
export const { resetContestants } = contestantSlice.actions;
export const selectContestants = (state) => state.contestants.contestants;
export const selectSelectedContestant = (state) =>
  state.contestants.selectedContestant;
export const selectLoading = (state) => state.contestants.loading;
export const selectError = (state) => state.contestants.error;

export default contestantSlice.reducer;
