import React from "react";
import Header from "./components/Header";
import SidebarMenu from "./components/SideBar";
import RulePage from "./pages/RulePage";
import HomePage from "./pages/HomePage";
import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="main-content">
          {/* Sidebar is always displayed on the left */}
          <SidebarMenu />

          {/* The routed content will be displayed here */}
          <div className="content-area">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rules" element={<RulePage />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
