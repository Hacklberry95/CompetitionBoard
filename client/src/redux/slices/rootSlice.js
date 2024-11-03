// src/redux/slices/rootSlice.js
import { createSlice } from "@reduxjs/toolkit";
import tournamentReducer from "./tournamentSlice";
import bracketReducer from "./bracketSlice";
import contestantReducer from "./contestantSlice";
import matchReducer from "./matchSlice";

const rootSlice = createSlice({
  name: "root",
  initialState: {
    storeReady: false,
  },
  reducers: {
    setStoreReady: (state) => {
      state.storeReady = true;
    },
  },
});

export const { setStoreReady } = rootSlice.actions;
export const selectStoreReady = (state) => state.root.storeReady;

export default rootSlice.reducer;
