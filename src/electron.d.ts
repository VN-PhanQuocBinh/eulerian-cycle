export interface IElectronAPI {
  on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
  off: (channel: string, listener: (...args: any[]) => void) => void;
  send: (channel: string, ...args: any[]) => void;
  invoke: (channel: string, ...args: any[]) => Promise<any>;

  saveGraph: (
    graphData: string,
  ) => Promise<{ success: boolean; message?: string; error?: string; filePath?: string }>;
  loadGraph: () => Promise<{ success: boolean; data?: string; error?: string; filePath?: string }>;
}

declare global {
  interface Window {
    ipcRenderer: IElectronAPI;
  }
}

export {};
