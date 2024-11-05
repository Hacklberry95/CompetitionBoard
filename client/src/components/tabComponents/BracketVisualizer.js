import React, { useEffect, useState } from "react";
import { Bracket, Seed, SeedItem, SeedTeam } from "react-brackets";
import { useDispatch, useSelector } from "react-redux";
import {
  declareWinner,
  fetchMatchesByBracketId,
} from "../../redux/slices/matchSlice";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const BracketVisualizer = ({ matches, contestantsMap }) => {
  const [winnersRounds, setWinnersRounds] = useState([]);
  const [losersRounds, setLosersRounds] = useState([]);
  const [localMatches, setLocalMatches] = useState(matches);
  const dispatch = useDispatch();
  const selectedBracket = useSelector(
    (state) => state.brackets.selectedBracket
  );

  useEffect(() => {
    if (selectedBracket && !matches.length) {
      dispatch(fetchMatchesByBracketId(selectedBracket));
    }
  }, [selectedBracket, dispatch]);

  useEffect(() => {
    setLocalMatches(matches);
  }, [matches]);

  useEffect(() => {
    if (!localMatches || !Array.isArray(localMatches)) {
      console.error("Matches data is undefined or not an array.");
      return;
    }

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
            { name: contestantsMap[match.Participant1Id] || "NO TEAM" },
            { name: contestantsMap[match.Participant2Id] || "NO TEAM" },
          ],
          match,
        });
      });
      return organizedRounds;
    };

    const winnersBracket = localMatches.filter(
      (match) => !match.isLosersBracket
    );
    const losersBracket = localMatches.filter((match) => match.isLosersBracket);

    setWinnersRounds(organizeRounds(winnersBracket));
    setLosersRounds(organizeRounds(losersBracket));
  }, [localMatches, contestantsMap]);

  const handleDeclareWinner = async (match, winnerId, loserId) => {
    const { id, isLosersBracket, BracketId, RoundNumber } = match;

    try {
      setLocalMatches((prevMatches) =>
        prevMatches.map((m) =>
          m.id === id ? { ...m, WinnerId: winnerId, LoserId: loserId } : m
        )
      );

      await dispatch(
        declareWinner({
          matchId: id,
          winnerId,
          loserId,
          isLosersBracket,
          bracketId: BracketId,
          roundNumber: RoundNumber,
        })
      );

      if (selectedBracket) {
        dispatch(fetchMatchesByBracketId(selectedBracket));
      } else {
        console.warn(
          "selectedBracket is undefined; cannot fetch matches by bracket ID."
        );
      }
    } catch (error) {
      console.error("Error declaring winner:", error);
    }
  };

  const CustomSeed = ({ seed, breakpoint }) => {
    const { match } = seed;
    const participant1Name = contestantsMap[match.Participant1Id] || "NO TEAM";
    const participant2Name = contestantsMap[match.Participant2Id] || "NO TEAM";

    return (
      <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
        <SeedItem>
          <div className="team-container">
            <SeedTeam style={{ display: "flex", alignItems: "center" }}>
              {participant1Name}
              <EmojiEventsIcon
                onClick={() =>
                  handleDeclareWinner(
                    match,
                    match.Participant1Id,
                    match.Participant2Id
                  )
                }
                style={{ cursor: "pointer", marginLeft: "5px", color: "gold" }}
              />
            </SeedTeam>
            <SeedTeam style={{ display: "flex", alignItems: "center" }}>
              {participant2Name}
              <EmojiEventsIcon
                onClick={() =>
                  handleDeclareWinner(
                    match,
                    match.Participant2Id,
                    match.Participant1Id
                  )
                }
                style={{ cursor: "pointer", marginLeft: "5px", color: "gold" }}
              />
            </SeedTeam>
          </div>
        </SeedItem>
      </Seed>
    );
  };

  return (
    <div className="bracket-visualizer">
      <h3>Winners' Bracket</h3>
      <Bracket rounds={winnersRounds} renderSeedComponent={CustomSeed} />

      <h3>Losers' Bracket</h3>
      <Bracket rounds={losersRounds} renderSeedComponent={CustomSeed} />
    </div>
  );
};

export default BracketVisualizer;
