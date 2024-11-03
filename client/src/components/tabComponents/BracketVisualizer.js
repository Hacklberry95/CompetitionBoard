import React, { useEffect, useState } from "react";
import { Bracket } from "react-brackets";
import contestantAPI from "../../api/contestantsAPI"; // Import your contestant API

const BracketVisualizer = ({ matches }) => {
  const [winnersRounds, setWinnersRounds] = useState([]);
  const [losersRounds, setLosersRounds] = useState([]);
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

        // Separate matches into winners' and losers' brackets
        const winnersBracket = matches.filter(
          (match) => !match.isLosersBracket
        );
        const losersBracket = matches.filter((match) => match.isLosersBracket);

        const organizeRounds = (matchesArray) => {
          const organizedRounds = [];
          matchesArray.forEach((match) => {
            const roundIndex = match.RoundNumber || 0;
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
          return organizedRounds;
        };

        setWinnersRounds(organizeRounds(winnersBracket));
        setLosersRounds(organizeRounds(losersBracket));
      } catch (error) {
        console.error("Error fetching contestants:", error);
      }
    };

    fetchContestants();
  }, [matches]);

  return (
    <div>
      <h3>Winners' Bracket</h3>
      <Bracket rounds={winnersRounds} />
      <h3>Losers' Bracket</h3>
      <Bracket rounds={losersRounds} />
    </div>
  );
};

export default BracketVisualizer;
