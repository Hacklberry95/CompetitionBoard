// src/components/EditTournamentModal.js
import React, { useState, useEffect } from "react";
import "../../styles/EditTournamentModal.css";

const EditTournamentModal = ({
  tournament,
  isOpen,
  onClose,
  onAddContestant,
  onRemoveContestant,
}) => {
  const [contestantName, setContestantName] = useState("");
  const [isAddingContestant, setIsAddingContestant] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setContestantName(""); // Reset when modal closes
    }
  }, [isOpen]);

  if (!isOpen || !tournament) return null;

  const handleAddContestant = async (e) => {
    e.preventDefault();

    if (!contestantName.trim()) {
      return; // Prevent empty submissions
    }

    setIsAddingContestant(true); // Set adding state to true

    try {
      await onAddContestant(tournament.id, contestantName.trim()); // Await the API call
      // Immediately reset the input after the addition is successful
      setContestantName("");
    } catch (error) {
      console.error("Error adding contestant:", error);
    } finally {
      setIsAddingContestant(false); // Reset adding state
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h3>Edit Tournament: {tournament.name}</h3>

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

        <h4>Contestants</h4>
        <ul className="contestants-edit-list">
          {tournament.contestants?.length > 0 ? (
            tournament.contestants.map((contestant) => (
              <li key={contestant.id}>
                {contestant.fullName}
                <button
                  onClick={() =>
                    onRemoveContestant(tournament.id, contestant.id)
                  }
                >
                  Remove
                </button>
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
