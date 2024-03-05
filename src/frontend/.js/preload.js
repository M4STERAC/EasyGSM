const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  close: () => ipcRenderer.send('app/close'),
  minimize: () => ipcRenderer.send('app/minimize'),
  maximize: () => ipcRenderer.send('app/maximize'),
});