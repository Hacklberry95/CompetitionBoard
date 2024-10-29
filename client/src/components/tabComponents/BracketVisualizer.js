// src/components/BracketVisualizer.js
import React, { useEffect, useState } from "react";
import { Bracket } from "react-brackets";
import contestantAPI from "../../api/contestantsAPI"; // Import your contestant API

const BracketVisualizer = ({ matches }) => {
  const [rounds, setRounds] = useState([]);
  const [contestantsMap, setContestantsMap] = useState({}); // Store contestants by ID

  useEffect(() => {
    if (!matches || !Array.isArray(matches)) {
      console.error("Matches data is undefined or not an array.");
      return;
    }

    const fetchContestants = async () => {
      try {
        // Assuming all contestant IDs are unique, gather unique IDs from matches
        const participantIds = new Set();
        matches.forEach((match) => {
          if (match.participant1Id) participantIds.add(match.participant1Id);
          if (match.participant2Id) participantIds.add(match.participant2Id);
        });

        // Convert Set to Array for API call
        const idsArray = Array.from(participantIds);

        // Fetch contestants
        const contestantsData = await Promise.all(
          idsArray.map((id) => contestantAPI.getContestantById(id)) // Assuming this API exists
        );

        // Create a mapping of contestant IDs to names
        const newContestantsMap = {};
        contestantsData.forEach((contestant) => {
          newContestantsMap[contestant.id] = contestant.Name;
        });

        setContestantsMap(newContestantsMap);
      } catch (error) {
        console.error("Error fetching contestants:", error);
      }
    };

    fetchContestants();
  }, [matches]);

  useEffect(() => {
    const organizedRounds = [];

    matches.forEach((match) => {
      const roundIndex = match.round || 0;
      if (!organizedRounds[roundIndex]) {
        organizedRounds[roundIndex] = {
          title: `Round ${roundIndex + 1}`,
          seeds: [],
        };
      }

      organizedRounds[roundIndex].seeds.push({
        id: match.id,
        teams: [
          { name: contestantsMap[match.participant1Id] || "NO TEAM" },
          { name: contestantsMap[match.participant2Id] || "NO TEAM" },
        ],
        winner: match.winnerId,
      });
    });

    setRounds(organizedRounds);
  }, [matches, contestantsMap]);

  return <Bracket rounds={rounds} />;
};

export default BracketVisualizer;
