import { ipcMain, dialog, app, BrowserWindow, Menu } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
createRequire(import.meta.url);
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  const menu = Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        {
          label: "Open Graph",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            win == null ? void 0 : win.webContents.send("request-load-graph");
          }
        },
        {
          label: "Save Graph",
          accelerator: "CmdOrCtrl+S",
          click: async () => {
            win == null ? void 0 : win.webContents.send("request-save-graph");
          }
        },
        {
          label: "Save Graph as Image",
          accelerator: "CmdOrCtrl+Shift+S",
          click: async () => {
            win == null ? void 0 : win.webContents.send("request-save-image");
          }
        },
        {
          type: "separator"
        },
        {
          label: "Exit",
          accelerator: "CmdOrCtrl+Q",
          click: () => {
            app.quit();
          }
        }
      ]
    },
    // {
    //   label: 'Edit',
    //   submenu: [
    //     { role: 'undo' },
    //     { role: 'redo' },
    //     { type: 'separator' },
    //     { role: 'cut' },
    //     { role: 'copy' },
    //     { role: 'paste' }
    //   ]
    // },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
}
ipcMain.handle("save-graph", async (_event, graphData) => {
  try {
    const { filePath, canceled } = await dialog.showSaveDialog({
      title: "Save Graph",
      defaultPath: path.join(app.getPath("documents"), "graph.json"),
      filters: [
        { name: "JSON Files", extensions: ["json"] },
        { name: "All Files", extensions: ["*"] }
      ]
    });
    if (canceled || !filePath) {
      return { success: false, error: "Save operation was canceled." };
    }
    await fs.writeFile(filePath, graphData, "utf-8");
    return { success: true, message: "Graph saved successfully." };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
ipcMain.handle("load-graph", async () => {
  console.log("Handling load-graph request...");
  try {
    const { filePaths, canceled } = await dialog.showOpenDialog({
      title: "Load Graph",
      defaultPath: app.getPath("documents"),
      filters: [
        { name: "JSON Files", extensions: ["json"] },
        { name: "All Files", extensions: ["*"] }
      ],
      properties: ["openFile"]
    });
    if (canceled || filePaths.length === 0) {
      return { success: false, error: "Load operation was canceled." };
    }
    const data = await fs.readFile(filePaths[0], "utf-8");
    return { success: true, data, filePath: filePaths[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
ipcMain.handle("save-image", async (event, base64Data) => {
  try {
    const { filePath, canceled } = await dialog.showSaveDialog({
      title: "Export Graph as Image",
      defaultPath: `graph-${Date.now()}.png`,
      filters: [{ name: "Images", extensions: ["png", "jpg"] }]
    });
    if (canceled || !filePath) {
      return { success: false, error: "Save operation was canceled." };
    }
    const base64Image = base64Data.split(";base64,").pop();
    fs.writeFile(filePath, base64Image, "base64");
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
