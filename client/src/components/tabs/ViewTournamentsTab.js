import React, { useEffect, useState } from "react";
import tournamentAPI from "../../api/tournamentAPI";
import "../../styles/ViewTournamentsTab.css";

const ViewTournamentsTab = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
  });
  const [contestantData, setContestantData] = useState({
    fullName: "",
    tournamentId: "",
  });

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

  const handleTournamentChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTournamentSubmit = async (e) => {
    e.preventDefault();
    try {
      await tournamentAPI.createTournament(formData);
      alert("Tournament created successfully!");
      setFormData({ name: "", date: "", location: "" });
      fetchTournaments();
    } catch (error) {
      console.error("Error creating tournament:", error);
    }
  };

  const handleContestantChange = (e) => {
    const { name, value } = e.target;
    setContestantData({ ...contestantData, [name]: value });
  };

  const handleContestantSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!contestantData.tournamentId) {
        alert("Please select a tournament");
        return;
      }
      await tournamentAPI.addContestantToTournament(
        contestantData.tournamentId,
        {
          fullName: contestantData.fullName,
        }
      );
      alert("Contestant added successfully!");
      setContestantData({ fullName: "", tournamentId: "" });
    } catch (error) {
      console.error("Error adding contestant:", error);
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
          onChange={handleTournamentChange}
        />
        <input
          type="date"
          name="date"
          placeholder="Tournament Date"
          value={formData.date}
          onChange={handleTournamentChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleTournamentChange}
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
            </tr>
          </thead>
          <tbody>
            {tournaments.length > 0 ? (
              tournaments.map((tournament) => (
                <tr key={tournament.id}>
                  <td>{tournament.name}</td>
                  <td>{new Date(tournament.date).toLocaleDateString()}</td>
                  <td>{tournament.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No tournaments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <form onSubmit={handleContestantSubmit} className="add-contestant-form">
        <h3>Add Contestant to Tournament</h3>
        <select
          name="tournamentId"
          value={contestantData.tournamentId}
          onChange={handleContestantChange}
        >
          <option value="">Select Tournament</option>
          {tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.id}>
              {tournament.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="fullName"
          placeholder="Contestant Full Name"
          value={contestantData.fullName}
          onChange={handleContestantChange}
        />
        <button type="submit">Add Contestant</button>
      </form>
    </div>
  );
};

export default ViewTournamentsTab;
