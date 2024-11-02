// src/components/modals/EditTournamentModal.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTournamentById,
  selectSelectedTournament,
} from "../../redux/slices/tournamentSlice";
import {
  fetchContestantsByTournamentId,
  selectContestants,
  addContestantToTournament,
  deleteContestantFromTournament,
  selectLoading,
  selectError,
} from "../../redux/slices/contestantSlice";
import "../../styles/EditTournamentModal.css";
import { Stack, IconButton } from "@mui/material";
import { DeleteForever, EditNote } from "@mui/icons-material";
import { useAlert } from "../../context/AlertContext";
import { armAndWeightCategories } from "../constants/WeightCategories";

const EditTournamentModal = ({ tournamentId, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const tournament = useSelector(selectSelectedTournament);
  const contestants = useSelector(selectContestants);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const { showSnackbar } = useAlert();

  // Local state for new contestant
  const [contestantName, setContestantName] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [division, setDivision] = useState("");
  const [gender, setGender] = useState("");
  const [armPreference, setArmPreference] = useState("");
  const [availableWeightCategories, setAvailableWeightCategories] = useState(
    []
  );

  useEffect(() => {
    if (isOpen && tournamentId) {
      console.log("EditTournamentModal useEffect: ", tournamentId);
      dispatch(fetchTournamentById(tournamentId));
      dispatch(fetchContestantsByTournamentId(tournamentId));
    }
  }, [dispatch, tournamentId, isOpen]);

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  const resetForm = () => {
    setContestantName("");
    setWeightKg("");
    setDivision("");
    setGender("");
    setArmPreference("");
    setAvailableWeightCategories([]);
  };

  // Update weight categories when gender or division changes
  useEffect(() => {
    if (gender && division) {
      const weights = armAndWeightCategories[division][gender];
      const allWeights = Object.keys(weights).reduce((acc, armType) => {
        return acc.concat(weights[armType].map((weight) => `${weight}`));
      }, []);
      setAvailableWeightCategories([...new Set(allWeights)]);
    } else {
      setAvailableWeightCategories([]);
    }
  }, [gender, division]);

  if (!isOpen || !tournament) return null;

  const handleAddContestant = async (e) => {
    e.preventDefault();
    if (!contestantName.trim()) {
      showSnackbar("Contestant name cannot be empty.", "warning");
      return;
    }

    const contestantData = {
      tournamentId: tournament.id,
      Name: contestantName.trim(),
      Gender: gender === "Male" ? "M" : "F",
      ArmPreference:
        armPreference === "Right"
          ? "R"
          : armPreference === "Left"
          ? "L"
          : armPreference === "Both"
          ? "B"
          : "NULL",
      WeightKg: parseFloat(weightKg),
      Division: division,
    };

    try {
      await dispatch(
        addContestantToTournament({
          tournamentId: tournament.id,
          contestantData,
        })
      ).unwrap();
      resetForm();
      showSnackbar("Contestant added successfully!", "success");
      dispatch(fetchContestantsByTournamentId(tournamentId));
    } catch (error) {
      console.error("Error adding contestant:", error);
      showSnackbar("Failed to add contestant.", "error");
    }
  };

  const handleRemoveContestant = async (contestantId) => {
    try {
      await dispatch(
        deleteContestantFromTournament({
          tournamentId: tournament.id,
          contestantId,
        })
      ).unwrap();
      showSnackbar("Contestant removed successfully!", "success");
      dispatch(fetchContestantsByTournamentId(tournamentId));
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
        <h3>{tournament.Name}</h3>

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
          <div className="dropdown-container-editModal">
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
              onChange={(e) => setDivision(e.target.value)}
            >
              <option value="">Select Division</option>
              <option value="Beginner">Beginner</option>
              <option value="Official">Official</option>
            </select>
            <select
              className="contestant-input-field"
              name="armPreference"
              value={armPreference}
              onChange={(e) => setArmPreference(e.target.value)}
            >
              <option value="">Select Arm Preference</option>
              <option value="Right">Right</option>
              <option value="Left">Left</option>
              <option value="Both">Both</option>
            </select>
            <select
              className="contestant-input-field"
              name="weightKg"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
            >
              <option value="">Select Weight Category</option>
              {availableWeightCategories.map((weightOption) => (
                <option key={weightOption} value={weightOption}>
                  {weightOption}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Add Contestant</button>
        </form>

        <h4 className="contestant-list-header">Contestants</h4>
        {loading ? (
          <p>Loading contestants...</p>
        ) : error ? (
          <p>Error loading contestants: {error}</p>
        ) : (
          <ul className="contestants-edit-list">
            <li className="contestants-header">
              <span>Name</span>
              <span>Weight</span>
              <span>Arm</span>
              <span>Category</span>
              <span>Actions</span>
            </li>
            <div className="contestants-list">
              {contestants.length > 0 ? (
                contestants.map((contestant) => (
                  <li key={contestant.id} className="contestant-row">
                    <span>{contestant.Name}</span>
                    <span>
                      {contestant.WeightKg >= 0
                        ? `+${contestant.WeightKg}`
                        : contestant.WeightKg}{" "}
                      kg
                    </span>
                    <span>
                      {contestant.ArmPreference === "R"
                        ? "Right"
                        : contestant.ArmPreference === "L"
                        ? "Left"
                        : contestant.ArmPreference === "B"
                        ? "Both"
                        : "N/A"}
                    </span>
                    <span>
                      {contestant.Gender === "M" ? "Male" : "Female"} -{" "}
                      {contestant.Division || "N/A"}
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
            </div>
          </ul>
        )}
      </div>
    </div>
  );
};

export default EditTournamentModal;
