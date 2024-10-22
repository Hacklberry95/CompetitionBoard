const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let reactProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Optional
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Start the React app
  reactProcess = spawn('npm', ['start'], { cwd: path.join(__dirname, '..', 'client') });

  // Load React app
  mainWindow.loadURL('http://localhost:3001');

  
  // Handle the React app's output
  reactProcess.stdout.on('data', (data) => {
    console.log(`React: ${data}`);
  });

  reactProcess.stderr.on('data', (data) => {
    console.error(`React error: ${data}`);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // When the main window is closed, kill the React process
  mainWindow.on('closed', () => {
    if (reactProcess) {
        reactProcess.kill('SIGINT'); // Use SIGINT to gracefully terminate
    }
    mainWindow = null;
    app.quit(); // Ensure the entire app quits
});

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
