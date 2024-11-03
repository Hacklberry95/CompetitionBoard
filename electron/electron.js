const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const {
  default: installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} = require("electron-devtools-installer");

const isDev = process.env.NODE_ENV !== "production";
let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"), // Load preload script
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
    mainWindow = null;
  });
}

app.on("ready", async () => {
  if (isDev) {
    // Install Redux and React DevTools extensions
    await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));
  }

  createWindow();
});

// Listen for the 'store-ready' event from the renderer process
ipcMain.on("store-ready", () => {
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
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
