// BracketVisualizer.js
import { Bracket } from "react-brackets";

const BracketVisualizer = ({ rounds }) => {
  // Check if rounds data is provided
  if (!rounds || rounds.length === 0) {
    return <p>No bracket data available.</p>;
  }

  return <Bracket rounds={rounds} />;
};

export default BracketVisualizer;
