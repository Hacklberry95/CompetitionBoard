// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices/rootSlice";
import tournamentReducer from "./slices/tournamentSlice";
import bracketReducer from "./slices/bracketSlice";
import contestantReducer from "./slices/contestantSlice";
import matchReducer from "./slices/matchSlice";
import { composeWithDevTools } from "redux-devtools-extension";

const store = configureStore({
  reducer: {
    root: rootReducer,
    tournaments: tournamentReducer,
    brackets: bracketReducer,
    contestants: contestantReducer,
    matches: matchReducer,
  },
  composeWithDevTools,
});

export default store;
