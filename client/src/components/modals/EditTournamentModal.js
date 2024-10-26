import React, { useState, useEffect } from "react";
import "../../styles/EditTournamentModal.css";
import { Stack, IconButton, Alert } from "@mui/material";
import { DeleteForever, EditNote } from "@mui/icons-material";
import { useAlert } from "../../context/AlertContext"; // Import useAlert

const EditTournamentModal = ({
  tournament,
  isOpen,
  onClose,
  onAddContestant,
  onRemoveContestant,
  refreshTournament,
}) => {
  const [contestantName, setContestantName] = useState("");
  const { showSnackbar } = useAlert(); // Get showAlert from context

  useEffect(() => {
    if (!isOpen) {
      setContestantName("");
    }
  }, [isOpen]);

  if (!isOpen || !tournament) return null;

  const handleAddContestant = async (e) => {
    e.preventDefault();

    if (!contestantName.trim()) {
      showSnackbar("Contestant name cannot be empty.", "warning");
      return;
    }

    try {
      await onAddContestant(tournament.id, contestantName.trim());
      setContestantName("");
      refreshTournament();
      showSnackbar("Contestant added successfully!", "success");
    } catch (error) {
      console.error("Error adding contestant:", error);
      showSnackbar("Failed to add contestant.", "error");
    }
  };

  const handleRemoveContestant = async (contestantId) => {
    try {
      await onRemoveContestant(tournament.id, contestantId);
      showSnackbar("Contestant removed successfully!", "success");
    } catch (error) {
      console.error("Error removing contestant:", error);
      showSnackbar("Failed to remove contestant.", "error");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h3>{tournament.name}</h3>

        <form onSubmit={handleAddContestant} className="add-contestant-form">
          <h4>Add Contestant</h4>
          <input
            className="contestant-input-field"
            type="text"
            name="fullName"
            placeholder="Contestant Full Name"
            value={contestantName}
            onChange={(e) => setContestantName(e.target.value)}
          />
          <button type="submit">Add Contestant</button>
        </form>

        <h4 className="contestant-list-header">Contestants</h4>
        <ul className="contestants-edit-list">
          <li className="contestants-header">
            <span>Name</span>
            <span>Weight</span>
            <span>Category</span>
            <span>Actions</span>
          </li>
          {tournament.contestants?.length > 0 ? (
            tournament.contestants.map((contestant) => (
              <li key={contestant.id} className="contestant-row">
                <span>{contestant.fullName}</span>
                <span>{contestant.weight}</span>
                <span>{contestant.category}</span>
                <Stack
                  spacing={2}
                  direction="row"
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <IconButton
                    onClick={() => handleRemoveContestant(contestant.id)}
                  >
                    <DeleteForever />
                  </IconButton>
                  <IconButton>
                    <EditNote />
                  </IconButton>
                </Stack>
              </li>
            ))
          ) : (
            <p>No contestants available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EditTournamentModal;
