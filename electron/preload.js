window.addEventListener("DOMContentLoaded", () => {
  // You can expose certain features to the renderer process here
  const { contextBridge } = require("electron");

  contextBridge.exposeInMainWorld("electron", {
    // Example: expose some API
    doSomething: () => {
      console.log("Doing something...");
    },
  });
});
