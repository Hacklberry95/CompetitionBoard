// src/tabs/ViewBracketTab.js
import React, { useEffect, useState } from "react";
import BracketVisualizer from "../tabComponents/BracketVisualizer";
import matchAPI from "../../api/matchAPI";
import bracketAPI from "../../api/bracketAPI";
import tournamentAPI from "../../api/tournamentAPI";
import "../../styles/ViewBracketTab.css";
import { useAlert } from "../../context/AlertContext";

const ViewBracketTab = ({ selectedTournament }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [brackets, setBrackets] = useState([]); // Store brackets here
  const [selectedBracket, setSelectedBracket] = useState(null); // Selected bracket
  const { showSnackbar } = useAlert();

  const fetchBrackets = async () => {
    if (!selectedTournament) return;
    try {
      const bracketData = await bracketAPI.getBracketsByTournamentId(
        selectedTournament
      );
      setBrackets(bracketData);
      if (bracketData.length > 0) {
        setSelectedBracket(bracketData[0].id); // Select the first bracket by default
      }
    } catch (error) {
      console.error("Error fetching brackets:", error);
      showSnackbar(error?.data?.error || "Failed to fetch brackets.", "error");
    }
  };

  const fetchMatches = async () => {
    if (!selectedBracket) return; // Only fetch matches if a bracket is selected
    setLoading(true);
    try {
      const matchData = await matchAPI.getMatchesByBracketId(selectedBracket);
      console.log("Match Data:", matchData);
      setMatches(matchData);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBrackets = async () => {
    if (!selectedTournament) return;

    setGenerating(true);
    try {
      const response = await tournamentAPI.getGeneratedBrackets(
        selectedTournament
      );

      if (response.status === 200) {
        showSnackbar(
          response.data.message || "Brackets generated successfully.",
          "success"
        );
        fetchBrackets(); // Fetch brackets again after generating
      } else {
        showSnackbar(response.data.error || "An error occurred.", "error");
      }
    } catch (error) {
      const errorMessage =
        error?.data?.error || "Failed to generate the matches!";
      console.error("Error response:", error);
      showSnackbar(errorMessage, "error");
    } finally {
      setGenerating(false);
    }
  };

  // Effect to fetch brackets and matches whenever selectedTournament changes
  useEffect(() => {
    fetchBrackets();
  }, [selectedTournament]);

  // Effect to fetch matches whenever selectedBracket changes
  useEffect(() => {
    fetchMatches();
  }, [selectedBracket]);

  return (
    <div className="view-bracket-tab">
      <div className="header-bracket-tab">
        <h2>Bracket View</h2>
        {brackets.length > 0 && (
          <div className="dropdown-container">
            <label htmlFor="bracket-select">Select Bracket:</label>
            <select
              id="bracket-select"
              value={selectedBracket || ""}
              onChange={(e) => setSelectedBracket(e.target.value)}
            >
              {brackets.map((bracket) => (
                <option key={bracket.id} value={bracket.id}>
                  {bracket.Division}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="actions">
        <button
          className="button"
          onClick={handleGenerateBrackets}
          disabled={generating}
        >
          {generating ? "Generating Brackets..." : "Generate Brackets"}
        </button>
      </div>

      {loading && <p>Loading matches...</p>}
      {!loading && matches.length === 0 && (
        <p>No matches available for this tournament.</p>
      )}

      <BracketVisualizer matches={matches} />
    </div>
  );
};

export default ViewBracketTab;
