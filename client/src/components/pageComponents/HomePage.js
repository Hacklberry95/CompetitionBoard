// src/pages/Homepage.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedTournament,
  selectTournaments,
  selectSelectedTournament,
} from "../../redux/slices/tournamentSlice";
import ViewBracketTab from "../tabs/ViewBracketTab";
import ViewTournamentsTab from "../tabs/ViewTournamentsTab";
import "../../styles/HomePage.css";

const Homepage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState("viewTournaments");

  // Access tournament data from Redux
  const tournaments = useSelector(selectTournaments) || [];
  const selectedTournament = useSelector(selectSelectedTournament);

  // Handle tournament selection
  const handleTournamentChange = (event) => {
    dispatch(setSelectedTournament(event.target.value));
  };
  useEffect(() => {
    if (!selectedTournament && tournaments.length > 0) {
      dispatch(setSelectedTournament(tournaments[0].id));
    }
  }, [selectedTournament, tournaments, dispatch]);

  const renderTabContent = () => {
    return activeTab === "bracketViewer" ? (
      <ViewBracketTab selectedTournament={selectedTournament} />
    ) : (
      <ViewTournamentsTab />
    );
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
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default Homepage;
