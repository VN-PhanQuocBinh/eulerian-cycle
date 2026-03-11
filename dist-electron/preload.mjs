"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  // You can expose other APTs you need here.
  saveGraph: (graphData) => electron.ipcRenderer.invoke("save-graph", graphData),
  loadGraph: () => electron.ipcRenderer.invoke("load-graph"),
  saveImage: (imageData) => electron.ipcRenderer.invoke("save-image", imageData),
  onRequestSaveGraph: (callback) => {
    electron.ipcRenderer.on("request-save-graph", callback);
    return () => electron.ipcRenderer.removeListener("request-save-graph", callback);
  },
  onRequestLoadGraph: (callback) => {
    electron.ipcRenderer.on("request-load-graph", callback);
    return () => electron.ipcRenderer.removeListener("request-load-graph", callback);
  },
  onRequestSaveImage: (callback) => {
    electron.ipcRenderer.on("request-save-image", callback);
    return () => electron.ipcRenderer.removeListener("request-save-image", callback);
  }
});
