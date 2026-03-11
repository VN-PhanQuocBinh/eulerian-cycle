import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
  saveGraph: (graphData: string) => ipcRenderer.invoke("save-graph", graphData),
  loadGraph: () => ipcRenderer.invoke("load-graph"),
  saveImage: (imageData: string) => ipcRenderer.invoke("save-image", imageData),

  onRequestSaveGraph: (callback: () => void) => {
    ipcRenderer.on("request-save-graph", callback);
    return () => ipcRenderer.removeListener("request-save-graph", callback);
  },
  onRequestLoadGraph: (callback: () => void) => {
    ipcRenderer.on("request-load-graph", callback);
    return () => ipcRenderer.removeListener("request-load-graph", callback);
  },

  onRequestSaveImage: (callback: () => void) => {
    ipcRenderer.on("request-save-image", callback);
    return () => ipcRenderer.removeListener("request-save-image", callback);
  },
});
