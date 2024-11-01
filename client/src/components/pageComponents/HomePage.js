// src/pages/Homepage.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewBracketTab from "../tabs/ViewBracketTab";
import ViewTournamentsTab from "../tabs/ViewTournamentsTab";
import {
  fetchAllTournaments,
  setSelectedTournament,
} from "../../redux/slices/tournamentSlice";
import {
  fetchContestantsByTournamentId,
  resetContestants,
} from "../../redux/slices/contestantSlice";
import { fetchBracketsByTournamentId } from "../../redux/slices/bracketSlice";
import { fetchMatchesByTournamentId } from "../../redux/slices/matchSlice";
import "../../styles/HomePage.css";

const Homepage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState("viewTournaments");

  const tournaments = useSelector((state) => state.tournaments.tournaments);
  console.log("Homepage tournaments: ", tournaments);
  const selectedTournament = useSelector(
    (state) => state.tournaments.selectedTournament
  );
  const contestants = useSelector((state) => state.tournaments.contestants);
  const matches = useSelector((state) => state.matches.matches);
  const loading = useSelector((state) => state.tournaments.loading);

  // Fetch tournaments on component mount
  useEffect(() => {
    dispatch(fetchAllTournaments());
  }, [dispatch]);

  // Fetch contestants and matches when a tournament is selected
  useEffect(() => {
    if (selectedTournament) {
      dispatch(fetchContestantsByTournamentId(selectedTournament));
      dispatch(fetchMatchesByTournamentId(selectedTournament));
      dispatch(fetchBracketsByTournamentId(selectedTournament));
    } else {
      dispatch(resetContestants());
    }
  }, [dispatch, selectedTournament]);

  // Handle tournament change from dropdown
  const handleTournamentChange = (event) => {
    const tournamentId = event.target.value;
    dispatch(setSelectedTournament(tournamentId)); // Update the selected tournament in the store
    if (tournamentId) {
      dispatch(fetchContestantsByTournamentId(tournamentId));
    } else {
      dispatch(resetContestants());
    }
  };

  // Render the appropriate tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "bracketViewer":
        return (
          <ViewBracketTab
            selectedTournament={selectedTournament}
            contestants={contestants}
            matches={matches}
          />
        );
      case "viewTournaments":
        return <ViewTournamentsTab contestants={contestants} />;
      default:
        return null;
    }
  };

  return (
    <div className="homepage">
      <nav>
        <div className="tab-buttons">
          <button onClick={() => setActiveTab("viewTournaments")}>
            Tournaments
          </button>
          <button onClick={() => setActiveTab("bracketViewer")}>Bracket</button>
        </div>
        <div className="dropdown-container">
          <select
            value={selectedTournament || ""}
            onChange={handleTournamentChange}
          >
            <option value="">Select a tournament</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.Name}
              </option>
            ))}
          </select>
        </div>
      </nav>
      <div className="tab-content">
        {loading ? <p>Loading...</p> : renderTabContent()}
      </div>
    </div>
  );
};

export default Homepage;
