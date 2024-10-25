import React from "react";
import Header from "./components/pageComponents/Header";
import SidebarMenu from "./components/pageComponents/SideBar";
import HomePage from "./components/pageComponents/HomePage";
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
          <HomePage />
        </div>
      </div>
    </Router>
  );
};

export default App;
