// src/pages/Homepage.js
import React, { useState, useEffect } from "react";
import ViewBracketTab from "../tabs/ViewBracketTab";
import ViewTournamentsTab from "../tabs/ViewTournamentsTab";
import tournamentAPI from "../../api/tournamentAPI";
import contestantAPI from "../../api/contestantsAPI";
import "../../styles/HomePage.css";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("viewTournaments");
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [contestants, setContestants] = useState([]);
  const [matches, setMatches] = useState([]); // New state for matches

  // Fetch tournaments
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const tournamentData = await tournamentAPI.getAllTournaments();
        setTournaments(tournamentData);
        if (tournamentData.length > 0) {
          setSelectedTournament(tournamentData[0].id);
          const contestantData =
            await contestantAPI.getContestantsByTournamentId(
              tournamentData[0].id
            );
          setContestants(contestantData);
        }
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    };

    fetchTournaments();
  }, []);

  // Fetch contestants when a tournament is selected
  const handleTournamentChange = async (event) => {
    const tournamentId = event.target.value;
    setSelectedTournament(tournamentId);

    if (tournamentId) {
      try {
        const contestantData = await contestantAPI.getContestantsByTournamentId(
          tournamentId
        );
        setContestants(contestantData);

        // Fetch matches after changing the tournament
        const matchesData = await tournamentAPI.getMatchesByTournamentId(
          tournamentId
        ); // New API call to fetch matches
        setMatches(matchesData); // Update state with fetched matches
      } catch (error) {
        console.error("Error fetching contestants or matches:", error);
      }
    } else {
      setContestants([]);
      setMatches([]); // Reset matches when no tournament is selected
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "bracketViewer":
        return (
          <ViewBracketTab
            selectedTournament={selectedTournament}
            contestants={contestants}
            matches={matches} // Pass matches to the ViewBracketTab
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
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default Homepage;
