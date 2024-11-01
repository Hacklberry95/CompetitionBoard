import React from "react";
import Header from "./components/pageComponents/Header";
import SidebarMenu from "./components/pageComponents/SideBar";
import HomePage from "./components/pageComponents/HomePage";
import { AlertProvider } from "./context/AlertContext";
import SnackbarMessage from "./components/helpers/SnackbarMessage";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles/App.css";
import { Provider } from "react-redux";
import store from "../src/redux/store";

const App = () => {
  return (
    <Router>
      <Provider store={store}>
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
      </Provider>
    </Router>
  );
};

export default App;
