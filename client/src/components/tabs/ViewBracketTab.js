// ViewBracketTab.js
import React, { useEffect, useState } from "react";
// import bracketAPI from "../../api/bracketAPI";

const ViewBracketTab = () => {
  const [bracketData, setBracketData] = useState(null);

  // useEffect(() => {
  //   const fetchBracketData = async () => {
  //     try {
  //       const data = await bracketAPI.getBracket();
  //       setBracketData(data);
  //     } catch (error) {
  //       console.error("Error fetching bracket data:", error);
  //     }
  //   };

  //   fetchBracketData();
  // }, []);

  if (!bracketData) return <p>Loading bracket...</p>;

  return (
    <div>
      <h2>Bracket Visualization</h2>
      {/* Visualization logic goes here */}
      <pre>{JSON.stringify(bracketData, null, 2)}</pre>
    </div>
  );
};

export default ViewBracketTab;
