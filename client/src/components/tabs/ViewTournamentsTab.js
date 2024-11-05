// src/tabs/ViewTournamentsTab.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllTournaments,
  createTournament,
  deleteTournament,
  fetchTournamentById,
  clearSelectedTournament,
} from "../../redux/slices/tournamentSlice";
import EditTournamentModal from "../modals/EditTournamentModal";
import "../../styles/ViewTournamentsTab.css";
import { Stack, IconButton } from "@mui/material";
import { EditNote, DeleteForever } from "@mui/icons-material";
import { useAlert } from "../../context/AlertContext";
import ConfirmationDialog from "../helpers/ConfirmationDialog";

const ViewTournamentsTab = () => {
  const dispatch = useDispatch();
  const tournaments = useSelector((state) => state.tournaments.tournaments);
  const loading = useSelector((state) => state.tournaments.loading);
  const { showSnackbar } = useAlert();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [selectedTournamentForDeletion, setSelectedTournamentForDeletion] =
    useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    Date: "",
    Location: "",
  });

  // Fetch tournaments on component mount
  useEffect(() => {
    dispatch(fetchAllTournaments());
  }, [dispatch]);

  const openModal = async (tournament) => {
    setSelectedTournamentId(tournament.id);
    await dispatch(fetchTournamentById(tournament.id));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(clearSelectedTournament());
  };

  const handleTournamentCreate = async (e) => {
    e.preventDefault();
    const { Name, Date, Location } = formData;

    if (!Name || !Date || !Location) {
      showSnackbar("Please fill in all fields.", "warning");
      return;
    }

    try {
      await dispatch(createTournament(formData)).unwrap();
      showSnackbar("Tournament created successfully!", "success");
      setFormData({ Name: "", Date: "", Location: "" });
      dispatch(fetchAllTournaments()); // Refresh tournament list
    } catch (error) {
      showSnackbar("Failed to create tournament.", "error");
    }
  };

  const deleteTournamentHandler = (tournament) => {
    setSelectedTournamentForDeletion(tournament);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(
        deleteTournament(selectedTournamentForDeletion.id)
      ).unwrap();
      showSnackbar("Tournament deleted successfully!", "success");
    } catch (error) {
      showSnackbar("Error while deleting tournament!", "error");
    } finally {
      setIsDialogOpen(false);
      setSelectedTournamentForDeletion(null);
    }
  };

  return (
    <div className="view-tournaments">
      <form
        onSubmit={handleTournamentCreate}
        className="create-tournament-form"
      >
        <h3>Create a New Tournament</h3>
        <input
          type="text"
          placeholder="Tournament Name"
          value={formData.Name}
          onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Tournament Date"
          value={formData.Date}
          onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.Location}
          onChange={(e) =>
            setFormData({ ...formData, Location: e.target.value })
          }
          required
        />
        <button type="submit">Create Tournament</button>
      </form>

      <h2>All Tournaments</h2>
      {loading ? (
        <p>Loading tournaments...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(tournaments || []).map((tournament) => (
              <tr key={tournament.id}>
                <td>{tournament.Name}</td>
                <td>{new Date(tournament.Date).toLocaleDateString()}</td>
                <td>{tournament.Location}</td>
                <td>
                  <Stack direction="row">
                    <IconButton onClick={() => openModal(tournament)}>
                      <EditNote />
                    </IconButton>
                    <IconButton
                      onClick={() => deleteTournamentHandler(tournament)}
                    >
                      <DeleteForever />
                    </IconButton>
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <EditTournamentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        tournamentId={selectedTournamentId}
      />
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete the tournament "${selectedTournamentForDeletion?.Name}"? This will also delete all contestants in the tournament!`}
      />
    </div>
  );
};

export default ViewTournamentsTab;
