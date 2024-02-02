const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 650,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  win.loadFile(path.join(__dirname, 'out', 'src', 'ui', 'html', 'index.html'));
}

app.whenReady().then(createWindow);