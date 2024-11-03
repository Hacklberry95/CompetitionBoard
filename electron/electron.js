const { app, BrowserWindow, screen } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const {
  default: installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} = require("electron-devtools-installer");
const isDev = process.env.NODE_ENV !== "production";
let mainWindow;
let reactProcess;

function createWindow() {
  console.log("Creating Electron window...");
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
      webPreferences: {
        devTools: isDev,
      },
    },
  });

  if (isDev) {
    // Errors are thrown if the dev tools are opened
    // before the DOM is ready
    mainWindow.webContents.once("dom-ready", async () => {
      await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log("An error occurred: ", err))
        .finally(() => {
          mainWindow.webContents.openDevTools();
        });
    });
  }
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

  mainWindow.on("closed", () => (mainWindow = null));
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
