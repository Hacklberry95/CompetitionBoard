// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import tournamentReducer from "./slices/tournamentSlice";
import bracketReducer from "./slices/bracketSlice";
import contestantReducer from "./slices/contestantSlice";
import matchReducer from "./slices/matchSlice";

const store = configureStore({
  reducer: {
    tournaments: tournamentReducer,
    brackets: bracketReducer,
    contestants: contestantReducer,
    matches: matchReducer,
  },
});

export default store;
