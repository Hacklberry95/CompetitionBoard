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
        const participantIds = new Set();
        matches.forEach((match) => {
          if (match.Participant1Id) participantIds.add(match.Participant1Id);
          if (match.Participant2Id) participantIds.add(match.Participant2Id);
        });

        const idsArray = Array.from(participantIds);
        const contestantsData = await Promise.all(
          idsArray.map((id) => contestantAPI.getContestantById(id))
        );

        const newContestantsMap = {};
        contestantsData.forEach((contestant) => {
          newContestantsMap[contestant.id] = contestant.Name;
        });

        setContestantsMap(newContestantsMap);

        // Now organize rounds after contestantsMap is populated
        const organizedRounds = [];
        matches.forEach((match) => {
          const roundIndex = match.RoundNumber || 0; // Make sure to use the correct property
          if (!organizedRounds[roundIndex]) {
            organizedRounds[roundIndex] = {
              title: `Round ${roundIndex + 1}`,
              seeds: [],
            };
          }

          organizedRounds[roundIndex].seeds.push({
            id: match.id,
            teams: [
              { name: newContestantsMap[match.Participant1Id] || "NO TEAM" },
              { name: newContestantsMap[match.Participant2Id] || "NO TEAM" },
            ],
            winner: match.WinnerId,
          });
        });

        setRounds(organizedRounds);
      } catch (error) {
        console.error("Error fetching contestants:", error);
      }
    };

    fetchContestants();
  }, [matches]);

  return <Bracket rounds={rounds} />;
};

export default BracketVisualizer;
