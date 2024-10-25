const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;
let reactProcess;

function createWindow() {
  console.log("Creating Electron window...");
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  setTimeout(() => {
    mainWindow
      .loadURL("http://localhost:3000")
      .then(() => console.log("Loaded React app in Electron window."))
      .catch((err) =>
        console.error("Failed to load URL in Electron window:", err)
      );
  }, 1500);

  mainWindow.on("closed", () => {
    if (reactProcess) {
      reactProcess.kill("SIGINT");
    }
    mainWindow = null;
  });
}

app.on("ready", () => {
  console.log("Electron app is ready");
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
