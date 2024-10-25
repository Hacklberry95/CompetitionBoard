// Homepage.js
import React, { useState } from "react";
import ViewBracketTab from "../tabs/ViewBracketTab";
import ViewTournamentsTab from "../tabs/ViewTournamentsTab";
import "../../styles/HomePage.css";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("viewTournaments");

  const renderTabContent = () => {
    switch (activeTab) {
      case "bracketViewer":
        return <ViewBracketTab />;
      case "viewTournaments":
        return <ViewTournamentsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="homepage">
      <nav>
        <button onClick={() => setActiveTab("viewTournaments")}>
          Tournaments
        </button>
        <button onClick={() => setActiveTab("bracketViewer")}>Bracket</button>
      </nav>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default Homepage;
