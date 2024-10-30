import React, { useEffect, useState } from "react";
import tournamentAPI from "../../api/tournamentAPI";
import contestantsAPI from "../../api/contestantsAPI";
import EditTournamentModal from "../modals/EditTournamentModal";
import "../../styles/ViewTournamentsTab.css";
import { Stack, IconButton } from "@mui/material";
import { EditNote, DeleteForever } from "@mui/icons-material";
import { useAlert } from "../../context/AlertContext";
import ConfirmationDialog from "../helpers/ConfirmationDialog";

const ViewTournamentsTab = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    Name: "",
    Date: "",
    Location: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const { showSnackbar } = useAlert();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, []);
  //<=========================================TOURNAMENT FUNCTIONS=========================================>
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
  // Fetches all tournaments for the list
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
  // Function for the submit button for creation of tournaments
  const handleTournamentCreate = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    const { Name, Date, Location } = formData;
    if (!Name || !Date || !Location) {
      showSnackbar("Please fill in all fields.", "warning");
      return;
    }
    try {
      const newTournament = await tournamentAPI.createTournament(formData);
      console.log(formData);
      showSnackbar("Tournament created successfully!", "success");
      fetchTournaments();
      setFormData({ Name: "", Date: "", Location: "" });
      setTournaments((prev) => [...prev, newTournament]); // Add the new tournament to the state
    } catch (error) {
      console.error("Error creating tournament:", error);
      showSnackbar("Failed to create tournament.", "error");
    }
  };
  // Confirmation for the delete button for deleting tournaments
  const deleteTournament = (tournament) => {
    setSelectedTournament(tournament);
    setIsDialogOpen(true); // Open the dialog
  };

  const handleConfirmDelete = async () => {
    if (!selectedTournament) return; // Safeguard
    try {
      await tournamentAPI.deleteTournament(selectedTournament.id);
      console.log("Tournament deleted successfully!");
      fetchTournaments(); // Refresh the list after deletion
      showSnackbar("Tournament deleted successfully!", "success");
    } catch (error) {
      console.error("Error while deleting tournament:", error);
      showSnackbar("Error while deleting tournament!", "error");
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedTournament(null);
  };
  //<=========================================END OFTOURNAMENT FUNCTIONS=========================================>
  //<=========================================MODAL FUNCTIONS=========================================>
  // Opens the EditTournamentModal
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
  // Closes the EditTournamentModal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTournament(null);
  };
  // Handles adding contestants to tournament function in the EditTournamentModal
  const handleAddContestant = async (tournamentId, contestantData) => {
    try {
      const newContestant = await tournamentAPI.addContestantToTournament(
        tournamentId,
        contestantData
      );
      console.log(tournamentId, contestantData);
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

  // Handles removing contestants from tournament function in the EditTournamentModal
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
  //<=========================================END OF MODAL FUNCTIONS=========================================>
  return (
    <div className="view-tournaments">
      <form
        onSubmit={handleTournamentCreate}
        className="create-tournament-form"
      >
        <h3>Create a New Tournament</h3>
        <input
          type="text"
          name="name"
          placeholder="Tournament Name"
          value={formData.Name}
          onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
        />
        <input
          type="date"
          name="date"
          placeholder="Tournament Date"
          value={formData.Date}
          onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.Location}
          onChange={(e) =>
            setFormData({ ...formData, Location: e.target.value })
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
                  <td>{tournament.Name}</td>
                  <td>{new Date(tournament.Date).toLocaleDateString()}</td>
                  <td>{tournament.Location}</td>
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
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={closeDialog}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete the tournament "${selectedTournament?.name}"?`}
      />
    </div>
  );
};

export default ViewTournamentsTab;
