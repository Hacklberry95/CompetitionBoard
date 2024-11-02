// src/tabs/ViewBracketTab.js
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
import { fetchMatchesByBracketId } from "../../redux/slices/matchSlice";
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
    (state) =>
      state.brackets.error || state.matches.error || state.contestants.error
  );

  const [selectedBracket, setSelectedBracket] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (selectedTournament) {
      dispatch(fetchBracketsByTournamentId(selectedTournament)).then(
        (result) => {
          if (result.payload?.length) setSelectedBracket(result.payload[0].id);
        }
      );
    } else {
      dispatch(clearBrackets());
      setSelectedBracket(null);
    }
  }, [selectedTournament, dispatch]);

  useEffect(() => {
    if (selectedBracket) {
      dispatch(fetchMatchesByBracketId(selectedBracket)).then((result) => {
        const participantIds = result.payload?.flatMap((match) => [
          match.Participant1Id,
          match.Participant2Id,
        ]);
        dispatch(fetchContestantsForMatches(participantIds));
      });
    }
  }, [selectedBracket, dispatch]);

  const handleGenerateBrackets = async () => {
    await dispatch(generateBracketsForTournament(selectedTournament));
    dispatch(fetchBracketsByTournamentId(selectedTournament));
  };

  const handleDeleteBrackets = async () => {
    await dispatch(deleteAllBrackets(selectedTournament));
    dispatch(fetchBracketsByTournamentId(selectedTournament));
    setSelectedBracket(null);
    setIsDialogOpen(false);
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
                  {bracket.Division} | {bracket.Gender} | {bracket.WeightClass}
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
      {error && <p>{error}</p>}
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
