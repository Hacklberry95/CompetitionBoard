import React, { useEffect, useState } from "react";
import tournamentAPI from "../src/api/tournamentAPI";

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await tournamentAPI.getAllTournaments();
        setTournaments(data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <div>
      <h1>Tournaments</h1>
      <ul>
        {tournaments.map((tournament) => (
          <li key={tournament.id}>
            {tournament.name} - {tournament.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TournamentList;
