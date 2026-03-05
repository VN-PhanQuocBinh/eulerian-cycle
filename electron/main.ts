import { app, BrowserWindow, ipcMain, dialog, Menu } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
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
            // const result = await handleLoad();
            // win?.webContents.send("graph-loaded", result);
            win?.webContents.send("request-load-graph");
          },
        },
        {
          label: "Save Graph",
          accelerator: "CmdOrCtrl+S",
          click: async () => {
            win?.webContents.send("request-save-graph");
          },
        },
        {
          label: "Save Graph as Image",
          accelerator: "CmdOrCtrl+Shift+S",
          click: async () => {
            win?.webContents.send("request-save-image");
          },
        },
        {
          type: "separator",
        },
        {
          label: "Exit",
          accelerator: "CmdOrCtrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
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
        { role: "zoomOut" },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
}

// IPC Handlers
ipcMain.handle("save-graph", async (_event, graphData: string) => {
  try {
    const { filePath, canceled } = await dialog.showSaveDialog({
      title: "Save Graph",
      defaultPath: path.join(app.getPath("documents"), "graph.json"),
      filters: [
        { name: "JSON Files", extensions: ["json"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (canceled || !filePath) {
      return { success: false, error: "Save operation was canceled." };
    }

    await fs.writeFile(filePath, graphData, "utf-8");
    return { success: true, message: "Graph saved successfully." };
  } catch (error) {
    return { success: false, error: (error as Error).message };
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
        { name: "All Files", extensions: ["*"] },
      ],
      properties: ["openFile"],
    });

    if (canceled || filePaths.length === 0) {
      return { success: false, error: "Load operation was canceled." };
    }

    const data = await fs.readFile(filePaths[0], "utf-8");
    return { success: true, data, filePath: filePaths[0] };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle("save-image", async (event, base64Data) => {
  const { filePath } = await dialog.showSaveDialog({
    title: "Export Graph as Image",
    defaultPath: `graph-${Date.now()}.png`,
    filters: [{ name: "Images", extensions: ["png", "jpg"] }],
  });

  if (filePath) {
    // Chuyển base64 về Buffer để ghi file
    const base64Image = base64Data.split(";base64,").pop();
    fs.writeFile(filePath, base64Image, "base64");
    return "Success";
  }
  return "Cancelled";
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
