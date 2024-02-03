const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');
const fs = require('fs');

ipcMain.handle('read-json', async (event, jsonFilePath) => {
  const data = fs.readFileSync(path.resolve(__dirname, jsonFilePath), 'utf-8');
  return JSON.parse(data);
});

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 650,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);