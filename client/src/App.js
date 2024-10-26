import React from "react";
import Header from "./components/pageComponents/Header";
import SidebarMenu from "./components/pageComponents/SideBar";
import HomePage from "./components/pageComponents/HomePage";
import { AlertProvider } from "./context/AlertContext";
import SnackbarMessage from "./components/helpers/SnackbarMessage";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles/App.css";

const App = () => {
  return (
    <Router>
      <AlertProvider>
        <div className="app-container">
          <Header />
          <SnackbarMessage />
          <div className="main-content">
            <SidebarMenu />
            <HomePage />
          </div>
        </div>
      </AlertProvider>
    </Router>
  );
};

export default App;
