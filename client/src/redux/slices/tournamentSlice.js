// src/redux/slices/tournamentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tournamentAPI from "../../api/tournamentAPI";

// Async actions
export const fetchAllTournaments = createAsyncThunk(
  "tournaments/fetchAllTournaments",
  async () => {
    const response = await tournamentAPI.getAllTournaments();
    return response;
  }
);

export const fetchTournamentById = createAsyncThunk(
  "tournaments/fetchTournamentById",
  async (id) => {
    const response = await tournamentAPI.getTournamentById(id);
    return response;
  }
);

export const createTournament = createAsyncThunk(
  "tournaments/createTournament",
  async (tournamentData) => {
    const response = await tournamentAPI.createTournament(tournamentData);
    return response;
  }
);

export const updateTournament = createAsyncThunk(
  "tournaments/updateTournament",
  async ({ id, tournamentData }) => {
    const response = await tournamentAPI.updateTournament(id, tournamentData);
    return response.data;
  }
);

export const deleteTournament = createAsyncThunk(
  "tournaments/deleteTournament",
  async (id) => {
    await tournamentAPI.deleteTournament(id);
    return id; // Return only the ID of the deleted tournament
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
    setSelectedTournament: (state, action) => {
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
      });
  },
});

// Selectors
export const selectTournaments = (state) => state.tournaments.tournaments || [];
export const selectSelectedTournament = (state) =>
  state.tournaments.selectedTournament;

// Export actions and reducer
export const { clearSelectedTournament, setSelectedTournament } =
  tournamentSlice.actions;

export default tournamentSlice.reducer;
