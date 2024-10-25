// Homepage.js
import React, { useState } from "react";
import ViewBracketTab from "../tabs/ViewBracketTab";
import ViewTournamentsTab from "../tabs/ViewTournamentsTab";
import "../../styles/HomePage.css";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("create");

  const renderTabContent = () => {
    switch (activeTab) {
      case "bracket":
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
        <button onClick={() => setActiveTab("bracket")}>Bracket</button>
        <button onClick={() => setActiveTab("viewTournaments")}>
          Tournaments
        </button>
      </nav>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default Homepage;
