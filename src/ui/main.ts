import { app, BrowserWindow } from 'electron';

let mainWindow: Electron.BrowserWindow | null;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 650,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  mainWindow.loadFile('./html/poc.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);