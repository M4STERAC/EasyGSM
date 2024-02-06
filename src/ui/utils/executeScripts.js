const { exec } = require('electron').remote.require('child_process');

export function executeBatchScript(pathToScript) {
  exec(pathToScript, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}