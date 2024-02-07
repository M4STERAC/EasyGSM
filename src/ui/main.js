const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');
const { exec } = require('child_process');

ipcMain.handle('execute-script', (event, command) => {
  const [scriptName, ...args] = command.split(' ');
  const scriptPath = path.join(__dirname, '..', 'data', scriptName);
  const absoluteCommand = `${scriptPath} ${args.join(' ')}`;
  console.log(`Executing command: ${absoluteCommand}`);
    return new Promise((resolve, reject) => {
        exec(absoluteCommand, (error, stdout, stderr) => {
            if (error) {
                reject(`exec error: ${error}`);
                return;
            }
            resolve(`stdout: ${stdout}`);
        });
    });
});

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 1200,
    minWidth: 800,
    minHeight: 550,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

//Make sure the main process validates all incoming IPC maessages to prevent unauthorized or malicious commands from being executed
//If I end up using network communication, make sure I use secure channeles (SSL/TLS)
//Limit permissions to only what is necessary for the renderrer process to perform its tasks
//If the batch scripts use input from the renderer, make sure to sanitize the input to prevent command injection attacks
//Use the latest versions of Electron and IPC libraries and dependencies to ensure the latest security patches are applied
//Implementing proper error handling can prevent an attacker from gaining useful information about the system
//Use code reviews and penn testing


//Possible vulnerabilities:
  //Command Injection: If the batch scripts use input from the renderer, they may be able to execute arbitrary commands on the system
  //Insecure IPC channelse: If the IPC channel is not secured, an attacker might be able to eavesdrop or send unauthorized commands to the main process
  //Insufficient Input Validation: If the main process does not properly validate incoming IPC messages, it might execute malicious commands or scripts
  //Insecure Dependencies: If the IPC libraries or other dependencies have known vulnerabilities, an attacker might be able to exploit them to compromise the system
  //Privilege Escalation: If the renderer process has more permissions than it needs, an attacker who compromises the render process might be able to perform unauthroized actions
  //Information Disclosure: If error messages or other outputs from the batch scripts are not handled properly, the might reveal sensitive information about the system
  //Lack of updates: If the system is not kept up to date with the latest security patches, it might be vulnerable to known exploits