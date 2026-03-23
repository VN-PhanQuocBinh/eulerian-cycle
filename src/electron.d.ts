export interface IElectronAPI {
  on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
  off: (channel: string, listener: (...args: any[]) => void) => void;
  send: (channel: string, ...args: any[]) => void;
  invoke: (channel: string, ...args: any[]) => Promise<any>;

  saveGraph: (
    graphData: string,
  ) => Promise<{ success: boolean; message?: string; error?: string; filePath?: string }>;
  loadGraph: () => Promise<{ success: boolean; data?: string; error?: string; filePath?: string }>;
  saveImage: (imageData: string) => Promise<{ success: boolean; error?: string }>;

  onRequestSaveGraph: (callback: () => void) => () => void;
  onRequestLoadGraph: (callback: () => void) => () => void;
  onRequestSaveImage: (callback: () => void) => () => void;

  windowControls: {
    minimize: () => Promise<boolean>;
    toggleMaximize: () => Promise<boolean>;
    isMaximized: () => Promise<boolean>;
    close: () => Promise<boolean>;
    onMaximizedChanged: (callback: (isMaximized: boolean) => void) => () => void;
  };

  appMenu: {
    openGraph: () => Promise<boolean>;
    saveGraph: () => Promise<boolean>;
    saveImage: () => Promise<boolean>;
    reload: () => Promise<boolean>;
    toggleDevTools: () => Promise<boolean>;
    zoomIn: () => Promise<boolean>;
    zoomOut: () => Promise<boolean>;
    resetZoom: () => Promise<boolean>;
  };
}

declare global {
  interface Window {
    ipcRenderer: IElectronAPI;
  }
}

export {};
