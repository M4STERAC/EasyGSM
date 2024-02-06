const { ipcMain } = require('electron');
const { exec } = require('child_process');

ipcMain.handle("execute-script", (event, scriptPath) => {
  exec(scriptPath, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
});