import React, { useEffect, useState } from "react";
import tournamentAPI from "../../api/tournamentAPI";
import contestantsAPI from "../../api/contestantsAPI";
import EditTournamentModal from "../modals/EditTournamentModal";
import "../../styles/ViewTournamentsTab.css";
import { Stack, IconButton, Alert } from "@mui/material";
import { EditNote, DeleteForever } from "@mui/icons-material";
import { useAlert } from "../../context/AlertContext"; // Import useAlert

const ViewTournamentsTab = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const { showSnackbar } = useAlert();

  useEffect(() => {
    fetchTournaments();
  }, []);

  // Refreshes the contestant list in the EditTounrmanet
  const refreshTournament = async (tournamentId) => {
    try {
      const fullTournament = await tournamentAPI.getTournamentById(
        tournamentId
      );
      const contestants = await contestantsAPI.getContestantsByTournamentId(
        tournamentId
      );
      setSelectedTournament({ ...fullTournament, contestants });
    } catch (error) {
      console.error("Error refreshing tournament details:", error);
    }
  };

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const data = await tournamentAPI.getAllTournaments();
      setTournaments(data);
    } catch (error) {
      console.error("Failed to fetch tournaments:", error);
      showSnackbar("Failed to fetch tournaments.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTournamentSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTournament = await tournamentAPI.createTournament(formData);
      showSnackbar("Tournament created successfully!", "success");
      fetchTournaments();
      setFormData({ name: "", date: "", location: "" });
      setTournaments([...tournaments, newTournament]);
    } catch (error) {
      console.error("Error creating tournament:", error);
      showSnackbar("Failed to create tournament.", "error");
    }
  };

  const openModal = async (tournament) => {
    try {
      const fullTournament = await tournamentAPI.getTournamentById(
        tournament.id
      );
      const contestants = await contestantsAPI.getContestantsByTournamentId(
        tournament.id
      );
      setSelectedTournament({ ...fullTournament, contestants });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching tournament details:", error);
    }
  };

  const deleteTournament = async (tournament) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the tournament "${tournament.name}"?`
    );

    if (confirmed) {
      try {
        await tournamentAPI.deleteTournament(tournament.id);
        showSnackbar("Tournament deleted successfully!", "success");
        fetchTournaments(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting tournament:", error);
        showSnackbar("Error while deleting tournament!", "error");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTournament(null);
  };

  const handleAddContestant = async (tournamentId, fullName) => {
    try {
      const newContestant = await tournamentAPI.addContestantToTournament(
        tournamentId,
        { fullName }
      );
      showSnackbar("Contestant added successfully!", "success");
      setSelectedTournament((prev) => ({
        ...prev,
        contestants: [...prev.contestants, newContestant],
      }));
    } catch (error) {
      console.error("Error adding contestant:", error);
      showSnackbar("Failed to add contestant.", "error");
    }
  };

  const handleRemoveContestant = async (tournamentId, contestantId) => {
    try {
      await contestantsAPI.deleteContestant(tournamentId, contestantId);
      showSnackbar("Contestant removed successfully!", "success");
      setSelectedTournament((prev) => ({
        ...prev,
        contestants: prev.contestants.filter((c) => c.id !== contestantId),
      }));
    } catch (error) {
      console.error("Error removing contestant:", error);
      showSnackbar("Failed to remove contestant.", "error");
    }
  };

  return (
    <div className="view-tournaments">
      <form
        onSubmit={handleTournamentSubmit}
        className="create-tournament-form"
      >
        <h3>Create a New Tournament</h3>
        <input
          type="text"
          name="name"
          placeholder="Tournament Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="date"
          name="date"
          placeholder="Tournament Date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
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
            {tournaments.length > 0 ? (
              tournaments.map((tournament) => (
                <tr key={tournament.id}>
                  <td>{tournament.name}</td>
                  <td>{new Date(tournament.date).toLocaleDateString()}</td>
                  <td>{tournament.location}</td>
                  <td>
                    <Stack
                      spacing={2}
                      direction="row"
                      sx={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <IconButton onClick={() => openModal(tournament)}>
                        <EditNote />
                      </IconButton>
                      <IconButton onClick={() => deleteTournament(tournament)}>
                        <DeleteForever />
                      </IconButton>
                    </Stack>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No tournaments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <EditTournamentModal
        tournament={selectedTournament}
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddContestant={handleAddContestant}
        onRemoveContestant={handleRemoveContestant}
        refreshTournament={() => refreshTournament(selectedTournament.id)}
      />
    </div>
  );
};

export default ViewTournamentsTab;
