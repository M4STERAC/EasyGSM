const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
    getPid: (callback) => ipcRenderer.on('get-pid', (_event, value) => callback(value)),
  });