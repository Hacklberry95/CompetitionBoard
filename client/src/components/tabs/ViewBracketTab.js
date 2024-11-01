// src/tabs/ViewBracketTab.js
import React, { useEffect, useState } from "react";
import BracketVisualizer from "../tabComponents/BracketVisualizer";
import matchAPI from "../../api/matchAPI";
import bracketAPI from "../../api/bracketAPI";
import tournamentAPI from "../../api/tournamentAPI";
import "../../styles/ViewBracketTab.css";
import { useAlert } from "../../context/AlertContext";
import ConfirmationDialog from "../helpers/ConfirmationDialog";

const ViewBracketTab = ({ selectedTournament }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [brackets, setBrackets] = useState([]);
  const [selectedBracket, setSelectedBracket] = useState(null);
  const { showSnackbar } = useAlert();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchBrackets = async () => {
    if (!selectedTournament) return;
    try {
      const bracketData = await bracketAPI.getBracketsByTournamentId(
        selectedTournament
      );
      console.log("Fetched brackets: ", bracketData);
      setBrackets(bracketData);
      if (bracketData.length > 0) {
        setSelectedBracket(bracketData[0].id);
      }
    } catch (error) {
      console.error("Error fetching brackets:", error);
      showSnackbar(error?.data?.error || "Failed to fetch brackets.", "error");
    }
  };

  const fetchMatches = async () => {
    if (!selectedBracket) return;
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
        fetchBrackets();
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
  // <================ BRACKET DELETE FUNCTIONS ================>
  const deleteBrackets = () => {
    setIsDialogOpen(true);
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDeleteBrackets = async () => {
    if (!selectedTournament) return;

    try {
      const response = await tournamentAPI.deleteGenerateBrackets(
        selectedTournament
      );

      if (response.status === 200) {
        showSnackbar(
          response.data.message || "Brackets deleted successfully.",
          "success"
        );
        fetchBrackets();
        fetchMatches();
      } else if (response.status === 404) {
        showSnackbar(
          response.data.message || "No BracketEntries found to delete.",
          "error"
        );
      } else {
        showSnackbar(response.data.error || "An error occurred.", "error");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete the brackets!";
      console.error("Error response:", error);
      showSnackbar(errorMessage, "error");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchBrackets();
  }, [selectedTournament]);

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
                  {bracket.Division} | {bracket.Gender} | {bracket.WeightClass}
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
        <button className="button" onClick={deleteBrackets}>
          Delete All Brackets
        </button>
      </div>

      {loading && <p>Loading matches...</p>}
      {!loading && matches.length === 0 && (
        <p>No matches available for this tournament.</p>
      )}

      <BracketVisualizer matches={matches} />
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={closeDialog}
        onConfirm={handleDeleteBrackets}
        message={`Are you sure you want to delete ALL of the brackets?`}
      />
    </div>
  );
};

export default ViewBracketTab;
