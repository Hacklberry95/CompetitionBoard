// src/redux/tournamentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tournamentAPI from "../../api/tournamentAPI"; // Adjust the import path as needed

// Async actions
export const fetchAllTournaments = createAsyncThunk(
  "tournaments/fetchAllTournaments",
  async () => {
    const response = await tournamentAPI.getAllTournaments();
    return response; // Assuming this is an array of tournaments
  }
);

export const fetchTournamentById = createAsyncThunk(
  "tournaments/fetchTournamentById",
  async (id) => {
    const response = await tournamentAPI.getTournamentById(id);
    console.log("Fetched tournament data: ", response);
    return response; // Returning the tournament data
  }
);

export const createTournament = createAsyncThunk(
  "tournaments/createTournament",
  async (tournamentData) => {
    const response = await tournamentAPI.createTournament(tournamentData);
    return response; // Returning the newly created tournament
  }
);

export const updateTournament = createAsyncThunk(
  "tournaments/updateTournament",
  async ({ id, tournamentData }) => {
    const response = await tournamentAPI.updateTournament(id, tournamentData);
    return response; // Returning the updated tournament
  }
);

export const deleteTournament = createAsyncThunk(
  "tournaments/deleteTournament",
  async (id) => {
    await tournamentAPI.deleteTournament(id);
    return id; // Returning the ID of the deleted tournament
  }
);

// FIX THIS?!?!?!
export const addContestantToTournament = createAsyncThunk(
  "tournaments/addContestantToTournament",
  async ({ tournamentId, contestantData }) => {
    const response = await tournamentAPI.addContestantToTournament(
      tournamentId,
      contestantData
    );
    return response; // Returning the added contestant data
  }
);

const tournamentSlice = createSlice({
  name: "tournaments",
  initialState: {
    tournaments: [],
    selectedTournament: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearSelectedTournament: (state) => {
      state.selectedTournament = null;
    },
    setSelectedTournament(state, action) {
      state.selectedTournament = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTournaments.fulfilled, (state, action) => {
        state.tournaments = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchTournamentById.fulfilled, (state, action) => {
        state.selectedTournament = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchTournamentById.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createTournament.fulfilled, (state, action) => {
        state.tournaments.push(action.payload);
      })
      .addCase(updateTournament.fulfilled, (state, action) => {
        const index = state.tournaments.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.tournaments[index] = action.payload;
        }
      })
      .addCase(deleteTournament.fulfilled, (state, action) => {
        state.tournaments = state.tournaments.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(addContestantToTournament.fulfilled, (state, action) => {
        if (state.selectedTournament) {
          state.selectedTournament.contestants.push(action.payload);
        }
      });
  },
});

export const { clearSelectedTournament, setSelectedTournament } =
  tournamentSlice.actions;
export default tournamentSlice.reducer;
