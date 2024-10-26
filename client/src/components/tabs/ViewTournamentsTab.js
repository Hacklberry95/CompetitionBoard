import React, { useEffect, useState } from "react";
import tournamentAPI from "../../api/tournamentAPI";
import contestantsAPI from "../../api/contestantsAPI";
import EditTournamentModal from "../modals/EditTournamentModal";
import "../../styles/ViewTournamentsTab.css";
import { Stack, IconButton } from "@mui/material";
import { EditNote, DeleteForever } from "@mui/icons-material";

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

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const data = await tournamentAPI.getAllTournaments();
      setTournaments(data);
    } catch (error) {
      console.error("Failed to fetch tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTournamentSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTournament = await tournamentAPI.createTournament(formData);
      alert("Tournament created successfully!");
      setFormData({ name: "", date: "", location: "" });
      setTournaments([...tournaments, newTournament]);
    } catch (error) {
      console.error("Error creating tournament:", error);
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
        alert("Tournament deleted successfully!");
        fetchTournaments(); // Refresh the list after deletion
      } catch (error) {
        alert("Error while deleting tournament!");
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
      alert("Contestant added successfully!");
      setSelectedTournament((prev) => ({
        ...prev,
        contestants: [...prev.contestants, newContestant],
      }));
    } catch (error) {
      console.error("Error adding contestant:", error);
    }
  };

  const handleRemoveContestant = async (tournamentId, contestantId) => {
    try {
      await contestantsAPI.deleteContestant(tournamentId, contestantId);
      alert("Contestant removed successfully!");
      setSelectedTournament((prev) => ({
        ...prev,
        contestants: prev.contestants.filter((c) => c.id !== contestantId),
      }));
    } catch (error) {
      console.error("Error removing contestant:", error);
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
                      sx={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
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
      />
    </div>
  );
};

export default ViewTournamentsTab;
