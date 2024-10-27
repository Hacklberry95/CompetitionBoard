import React, { useState, useEffect } from "react";
import "../../styles/EditTournamentModal.css";
import { Stack, IconButton } from "@mui/material";
import { DeleteForever, EditNote } from "@mui/icons-material";
import { useAlert } from "../../context/AlertContext";
import { armAndWeightCategories } from "../constants/WeightCategories"; // Adjust the path as necessary

const EditTournamentModal = ({
  tournament,
  isOpen,
  onClose,
  onAddContestant,
  onRemoveContestant,
  refreshTournament,
}) => {
  const [contestantName, setContestantName] = useState("");
  const { showSnackbar } = useAlert();
  const [weightCategory, setWeightCategory] = useState("");
  const [division, setDivision] = useState(""); // Corrected to use camelCase
  const [gender, setGender] = useState("");
  const [arm, setArm] = useState("");

  // State for available weight categories based on selected gender and division
  const [availableWeightCategories, setAvailableWeightCategories] = useState(
    []
  );

  useEffect(() => {
    if (!isOpen) {
      setContestantName("");
      setWeightCategory("");
      setDivision(""); // Reset division
      setGender(""); // Reset gender
      setArm(""); // Reset arm
      setAvailableWeightCategories([]); // Reset available weight categories
    }
  }, [isOpen]);

  // Update weight categories when gender or division changes
  useEffect(() => {
    if (gender && division) {
      const weights = armAndWeightCategories[division][gender];
      const allWeights = Object.keys(weights).reduce((acc, armType) => {
        return acc.concat(weights[armType].map((weight) => `${weight}`));
      }, []);
      // Use Set to remove duplicates
      setAvailableWeightCategories([...new Set(allWeights)]);
    } else {
      setAvailableWeightCategories([]);
    }
  }, [gender, division]);

  if (!isOpen || !tournament) return null;

  const handleAddContestant = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!contestantName.trim()) {
      showSnackbar("Contestant name cannot be empty.", "warning");
      return;
    }

    try {
      await onAddContestant(tournament.id, {
        fullName: contestantName.trim(),
        gender,
        arm,
        weightCategory,
        division,
      });
      setContestantName("");
      setWeightCategory("");
      setDivision(""); // Reset division after submission
      setGender(""); // Reset gender after submission
      setArm(""); // Reset arm after submission
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
          <select
            className="contestant-input-field"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select
            className="contestant-input-field"
            name="division"
            value={division}
            onChange={(e) => setDivision(e.target.value)} // Fixed casing here
          >
            <option value="">Select Division</option>
            <option value="Beginner">Beginner</option>
            <option value="Official">Official</option>
          </select>
          <select
            className="contestant-input-field"
            name="arm"
            value={arm}
            onChange={(e) => setArm(e.target.value)}
          >
            <option value="">Select Arm</option>
            <option value="Right">Right</option>
            <option value="Left">Left</option>
            <option value="Both">Both</option>
          </select>
          <select
            className="contestant-input-field"
            name="weightCategory"
            value={weightCategory}
            onChange={(e) => setWeightCategory(e.target.value)}
          >
            <option value="">Select Weight Category</option>
            {availableWeightCategories.map((weightOption) => (
              <option key={weightOption} value={weightOption}>
                {weightOption}
              </option>
            ))}
          </select>
          <button type="submit">Add Contestant</button>
        </form>

        <h4 className="contestant-list-header">Contestants</h4>
        <ul className="contestants-edit-list">
          <li className="contestants-header">
            <span>Name</span>
            <span>Weight</span>
            <span>Arm</span>
            <span>Category</span>
            <span>Actions</span>
          </li>
          {tournament.contestants?.length > 0 ? (
            tournament.contestants.map((contestant) => (
              <li key={contestant.id} className="contestant-row">
                <span>{contestant.fullName}</span>
                <span>{contestant.weightCategory}</span>
                <span>{contestant.arm}</span>
                <span>
                  {contestant.gender} - {contestant.division || "N/A"}{" "}
                  {/* Fixed to use division */}
                </span>
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
