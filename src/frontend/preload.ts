const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
    invoke: (channel: string, data: any) => ipcRenderer.invoke(channel, data)
});