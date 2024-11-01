// src/tabs/ViewBracketTab.js
import React, { useEffect } from "react";
import BracketVisualizer from "../tabComponents/BracketVisualizer";
import matchAPI from "../../api/matchAPI"; // This might be refactored if needed
import tournamentAPI from "../../api/tournamentAPI"; // Keep for generating brackets
import "../../styles/ViewBracketTab.css";
import { useAlert } from "../../context/AlertContext";
import ConfirmationDialog from "../helpers/ConfirmationDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBracketsByTournamentId,
  deleteAllBrackets,
  clearBrackets,
} from "../../redux/slices/bracketSlice";
import { fetchMatchesByBracketId } from "../../redux/slices/matchSlice"; // Assuming this exists

const ViewBracketTab = ({ selectedTournament }) => {
  const dispatch = useDispatch();
  const { showSnackbar } = useAlert();

  const brackets = useSelector((state) => state.brackets.brackets);
  const loadingBrackets = useSelector((state) => state.brackets.loading);
  const matches = useSelector((state) => state.matches.matches); // Assuming this is already set up
  const [selectedBracket, setSelectedBracket] = React.useState(null);
  const [generating, setGenerating] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Fetch brackets when selectedTournament changes
  useEffect(() => {
    if (selectedTournament) {
      dispatch(fetchBracketsByTournamentId(selectedTournament));
    } else {
      dispatch(clearBrackets());
    }
  }, [selectedTournament, dispatch]);

  // Fetch matches when selectedBracket changes
  useEffect(() => {
    if (selectedBracket) {
      dispatch(fetchMatchesByBracketId(selectedBracket)); // Assuming you have this function
    }
  }, [selectedBracket, dispatch]);

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
        dispatch(fetchBracketsByTournamentId(selectedTournament)); // Re-fetch brackets
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

  const deleteBrackets = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDeleteBrackets = async () => {
    if (!selectedTournament) return;

    try {
      const response = await dispatch(deleteAllBrackets(selectedTournament));

      if (response.payload.status === 200) {
        showSnackbar(
          response.payload.message || "Brackets deleted successfully.",
          "success"
        );
        dispatch(fetchBracketsByTournamentId(selectedTournament)); // Re-fetch brackets
      } else if (response.payload.status === 404) {
        showSnackbar(
          response.payload.message || "No BracketEntries found to delete.",
          "error"
        );
      } else {
        showSnackbar(response.payload.error || "An error occurred.", "error");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete the brackets!";
      console.error("Error response:", error);
      showSnackbar(errorMessage, "error");
    }
  };

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

      {loadingBrackets && <p>Loading matches...</p>}
      {!loadingBrackets && matches.length === 0 && (
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
