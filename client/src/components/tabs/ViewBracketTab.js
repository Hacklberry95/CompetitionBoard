// src/tabs/ViewBracketTab.js
import React, { useEffect, useState } from "react";
import BracketVisualizer from "../tabComponents/BracketVisualizer";
import matchAPI from "../../api/matchAPI";
import tournamentAPI from "../../api/tournamentAPI";
import "../../styles/ViewBracketTab.css";
import { useAlert } from "../../context/AlertContext";

const ViewBracketTab = ({ selectedTournament, contestants }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { showSnackbar } = useAlert();

  const fetchMatches = async () => {
    if (!selectedTournament) return;
    setLoading(true);
    try {
      const matchData = await matchAPI.getMatchesByTournamentId(
        selectedTournament
      );
      console.log("Match Data:", matchData);
      console.log("ViewBracketTab current tournament: ", selectedTournament);
      setMatches(matchData);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBrackets = async () => {
    if (!selectedTournament) return;

    setGenerating(true); // Start generating brackets
    try {
      await tournamentAPI.getGeneratedBrackets(selectedTournament); // Call the API to generate brackets
      showSnackbar("Generated the matches!");
      fetchMatches(); // Fetch matches again after generating brackets
    } catch (error) {
      showSnackbar("Failed to generate the matches!");
      console.error("Error generating brackets:", error);
    } finally {
      setGenerating(false); // Reset generating state
    }
  };

  // Effect to fetch matches whenever selectedTournament changes
  useEffect(() => {
    fetchMatches();
  }, [selectedTournament]);

  return (
    <div className="view-bracket-tab">
      <div className="header">
        <h2>Bracket View</h2>
      </div>
      {loading && <p>Loading matches...</p>}
      {!loading && matches.length === 0 && (
        <p>No matches available for this tournament.</p>
      )}

      {selectedTournament && !loading && (
        <>
          <button onClick={handleGenerateBrackets} disabled={generating}>
            {generating ? "Generating Brackets..." : "Generate Brackets"}
          </button>
          <BracketVisualizer matches={matches} />
        </>
      )}
    </div>
  );
};

export default ViewBracketTab;
