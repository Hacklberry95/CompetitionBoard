import React, { useEffect, useState } from "react";
import {
  Bracket,
  Seed,
  SingleLineSeed,
  SeedItem,
  SeedTeam,
} from "react-brackets";
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
  const [finalMatchCreated, setFinalMatchCreated] = useState(false);
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
    if (finalMatchCreated) {
      dispatch(fetchMatchesByBracketId(selectedBracket));
    }
  }, [finalMatchCreated, selectedBracket, dispatch]);

  useEffect(() => {
    if (!localMatches || !Array.isArray(localMatches)) {
      console.error("Matches data is undefined or not an array.");
      return;
    }

    const organizeRounds = (matchesArray) => {
      const organizedRounds = [];
      let finalMatch = null;

      matchesArray.forEach((match) => {
        if (match.RoundNumber === 999) {
          // Use the special integer for the final round
          finalMatch = {
            title: "Final",
            seeds: [
              {
                id: match.id,
                teams: [
                  { name: contestantsMap[match.Participant1Id] || "NO TEAM" },
                  { name: contestantsMap[match.Participant2Id] || "NO TEAM" },
                ],
                match,
              },
            ],
          };
        } else {
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
        }
      });

      // Append the final match as the last round
      if (finalMatch) {
        organizedRounds.push(finalMatch);
      }

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

      const response = await dispatch(
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
      }

      // Update the UI if the final match is created
      if (response.payload?.finalMatchCreated) {
        setFinalMatchCreated(true);
        alert(
          "Final championship match created between winners' and losers' champions!"
        );
      }
    } catch (error) {
      console.error("Error declaring winner:", error);
    }
  };

  const CustomSeed = ({ seed, breakpoint, roundIndex, seedIndex }) => {
    const { match } = seed;
    const participant1Name = contestantsMap[match.Participant1Id] || "NO TEAM";
    const participant2Name = contestantsMap[match.Participant2Id] || "NO TEAM";

    // Check if this round has the same number of seeds as the next round
    const isLineConnector =
      losersRounds[roundIndex]?.seeds.length ===
      losersRounds[roundIndex + 1]?.seeds.length;
    const Wrapper = isLineConnector ? SingleLineSeed : Seed;

    return (
      <Wrapper mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
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
      </Wrapper>
    );
  };

  return (
    <div className="bracket-visualizer">
      <h3>Winners' Bracket</h3>
      <Bracket rounds={winnersRounds} renderSeedComponent={CustomSeed} />

      <h3>Losers' Bracket</h3>
      <Bracket rounds={losersRounds} renderSeedComponent={CustomSeed} />

      {finalMatchCreated && (
        <div className="champion-banner">
          <h2>Final Match! Determine the Champion!</h2>
        </div>
      )}
    </div>
  );
};

export default BracketVisualizer;
