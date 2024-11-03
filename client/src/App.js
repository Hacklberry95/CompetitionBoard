import React, { useEffect } from "react";
import Header from "./components/pageComponents/Header";
import SidebarMenu from "./components/pageComponents/SideBar";
import HomePage from "./components/pageComponents/HomePage";
import { AlertProvider } from "./context/AlertContext";
import SnackbarMessage from "./components/helpers/SnackbarMessage";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles/App.css";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "../src/redux/store";
import { setStoreReady, selectStoreReady } from "./redux/slices/rootSlice";

// Move initialization logic into a child component
const AppContent = () => {
  const dispatch = useDispatch();
  const storeReady = useSelector(selectStoreReady);

  useEffect(() => {
    const initializeStore = async () => {
      // Perform any initialization logic here, such as loading data
      dispatch(setStoreReady()); // Mark the store as ready
    };

    initializeStore();
  }, [dispatch]);

  useEffect(() => {
    if (storeReady && window.electronAPI) {
      window.electronAPI.notifyStoreReady();
    }
  }, [storeReady]);

  return (
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
  );
};

// Wrap the entire app with Provider at the root level
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;
