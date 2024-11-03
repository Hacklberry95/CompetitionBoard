const { contextBridge, ipcRenderer } = require("electron");

// Expose a function to the renderer process to signal that the store is ready
contextBridge.exposeInMainWorld("electronAPI", {
  notifyStoreReady: () => ipcRenderer.send("store-ready"),
});
