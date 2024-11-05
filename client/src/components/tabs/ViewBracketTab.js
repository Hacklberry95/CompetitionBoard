import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BracketVisualizer from "../tabComponents/BracketVisualizer";
import "../../styles/ViewBracketTab.css";
import { useAlert } from "../../context/AlertContext";
import ConfirmationDialog from "../helpers/ConfirmationDialog";
import {
  deleteAllBrackets,
  clearBrackets,
  generateBracketsForTournament,
  fetchBracketsByTournamentId,
} from "../../redux/slices/bracketSlice";
import {
  fetchMatchesByBracketId,
  clearMatches,
} from "../../redux/slices/matchSlice";
import { fetchContestantsForMatches } from "../../redux/slices/contestantSlice";

const ViewBracketTab = ({ selectedTournament }) => {
  const dispatch = useDispatch();
  const { showSnackbar } = useAlert();
  const brackets = useSelector((state) => state.brackets.brackets);
  const matches = useSelector((state) => state.matches.matches);
  const contestantsMap = useSelector(
    (state) => state.contestants.contestantsMap
  );
  const loadingBrackets = useSelector((state) => state.brackets.loading);
  const error = useSelector(
    (state) => state.brackets.error || state.matches.error
  );

  const [selectedBracket, setSelectedBracket] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBrackets = async () => {
      if (selectedTournament) {
        await dispatch(fetchBracketsByTournamentId(selectedTournament));
      } else {
        dispatch(clearBrackets());
        setSelectedBracket(null);
      }
    };

    fetchBrackets();
  }, [selectedTournament, dispatch]);

  useEffect(() => {
    if (brackets.length > 0) {
      setSelectedBracket(brackets[0].id);
    } else {
      setSelectedBracket(null);
    }
  }, [brackets]);

  useEffect(() => {
    const fetchMatchesAndContestants = async () => {
      if (selectedBracket) {
        const result = await dispatch(fetchMatchesByBracketId(selectedBracket));
        const participantIds = result.payload?.flatMap((match) => [
          match.Participant1Id,
          match.Participant2Id,
        ]);
        if (participantIds) {
          await dispatch(fetchContestantsForMatches(participantIds));
        }
      } else {
        dispatch(clearMatches());
      }
    };

    fetchMatchesAndContestants();
  }, [selectedBracket, dispatch]);

  const handleGenerateBrackets = async () => {
    const response = await dispatch(
      generateBracketsForTournament(selectedTournament)
    );

    if (generateBracketsForTournament.fulfilled.match(response)) {
      const newBracketId = await dispatch(
        fetchBracketsByTournamentId(selectedTournament)
      );
      if (newBracketId.payload.length > 0) {
        setSelectedBracket(newBracketId.payload[0].id);
      }
      showSnackbar(
        response.payload.message || "Brackets generated successfully!",
        "success"
      );
    } else {
      showSnackbar(
        response.payload || "Error while generating brackets!",
        "error"
      );
    }
  };

  const handleDeleteBrackets = async () => {
    const response = await dispatch(deleteAllBrackets(selectedTournament));

    if (deleteAllBrackets.fulfilled.match(response)) {
      await dispatch(fetchBracketsByTournamentId(selectedTournament));
      setSelectedBracket(null);
      setIsDialogOpen(false);
      showSnackbar(
        response.payload.message || "Brackets deleted successfully!",
        "success"
      );
    } else {
      showSnackbar(
        response.payload || "Error while deleting brackets!",
        "error"
      );
    }
  };

  return (
    <div className="view-bracket-tab">
      <div className="header-bracket-tab">
        <h2>Bracket View</h2>
        {brackets.length > 0 && (
          <div className="dropdown-container">
            <select
              id="bracket-select"
              value={selectedBracket || ""}
              onChange={(e) => setSelectedBracket(e.target.value)}
            >
              {brackets.map((bracket) => (
                <option key={bracket.id} value={bracket.id}>
                  {bracket.Division} | {bracket.Gender} | {bracket.WeightClass}{" "}
                  |{" "}
                  {bracket.Arm === "R"
                    ? "Right"
                    : bracket.Arm === "L"
                    ? "Left"
                    : bracket.Arm === "B"
                    ? "Both"
                    : "N/A"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="actions">
        <button className="button" onClick={handleGenerateBrackets}>
          Generate Brackets
        </button>
        <button className="button" onClick={() => setIsDialogOpen(true)}>
          Delete All Brackets
        </button>
      </div>

      {loadingBrackets && <p>Loading brackets...</p>}
      <BracketVisualizer matches={matches} contestantsMap={contestantsMap} />

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDeleteBrackets}
      />
    </div>
  );
};

export default ViewBracketTab;
