// src/components/ViewTournamentsTab.js
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

  // Fetch tournaments from the API
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tournamentAPI.createTournament(formData);
      alert("Tournament created successfully!");
      setFormData({ name: "", date: "", location: "" });
      fetchTournaments(); // Refresh the tournament list
    } catch (error) {
      console.error("Error creating tournament:", error);
    }
  };

  return (
    <div className="view-tournaments">
      {/* Tournament Creation Form */}
      <form onSubmit={handleSubmit} className="create-tournament-form">
        <h3>Create a New Tournament</h3>
        <input
          type="text"
          name="name"
          placeholder="Tournament Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          placeholder="Tournament Date"
          value={formData.date}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <button type="submit">Create Tournament</button>
      </form>

      {/* Tournament List Table */}
      <h2>All Tournaments</h2>
      {loading ? (
        <p>Loading tournaments...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.length > 0 ? (
              tournaments.map((tournament) => (
                <tr key={tournament.id}>
                  <td>{tournament.id}</td>
                  <td>{tournament.name}</td>
                  <td>{new Date(tournament.date).toLocaleDateString()}</td>
                  <td>{tournament.location}</td>
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
    </div>
  );
};

export default ViewTournamentsTab;
