import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...rest) => listener(event, ...rest));
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...rest] = args;
    return ipcRenderer.off(channel, ...rest);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...rest] = args;
    return ipcRenderer.send(channel, ...rest);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...rest] = args;
    return ipcRenderer.invoke(channel, ...rest);
  },

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

  windowControls: {
    minimize: () => ipcRenderer.invoke("window:minimize"),
    toggleMaximize: () => ipcRenderer.invoke("window:toggle-maximize"),
    isMaximized: () => ipcRenderer.invoke("window:is-maximized") as Promise<boolean>,
    close: () => ipcRenderer.invoke("window:close"),
    onMaximizedChanged: (callback: (isMaximized: boolean) => void) => {
      const handler = (_event: unknown, value: boolean) => callback(value);
      ipcRenderer.on("window:maximized-changed", handler);
      return () => ipcRenderer.removeListener("window:maximized-changed", handler);
    },
  },

  appMenu: {
    openGraph: () => ipcRenderer.invoke("app-menu:open-graph"),
    saveGraph: () => ipcRenderer.invoke("app-menu:save-graph"),
    saveImage: () => ipcRenderer.invoke("app-menu:save-image"),
    reload: () => ipcRenderer.invoke("app-menu:reload"),
    toggleDevTools: () => ipcRenderer.invoke("app-menu:toggle-devtools"),
    zoomIn: () => ipcRenderer.invoke("app-menu:zoom-in"),
    zoomOut: () => ipcRenderer.invoke("app-menu:zoom-out"),
    resetZoom: () => ipcRenderer.invoke("app-menu:reset-zoom"),
  },
});