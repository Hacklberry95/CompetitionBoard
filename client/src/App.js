import React from "react";
import Header from "./components/pageComponents/Header";
import SidebarMenu from "./components/pageComponents/SideBar";
import HomePage from "./components/pageComponents/HomePage";
import { AlertProvider } from "./context/AlertContext";
import SnackbarMessage from "./components/SnackbarMessage";
import "./styles/App.css";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <AlertProvider>
        <div className="app-container">
          <Header />
          <SnackbarMessage />
          <div className="main-content">
            {/* Sidebar is always displayed on the left */}
            <SidebarMenu />
            <HomePage />
          </div>
        </div>
      </AlertProvider>
    </Router>
  );
};

export default App;
