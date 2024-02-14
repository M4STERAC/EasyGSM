const { saveBounds, getWindowSettings } = require("./settings.js");
const { app, BrowserWindow } = require("electron");
const { ipcMain, dialog } = require("electron");
const store = require("electron-store");
const os = require("os");
const { spawn } = require("child_process");
const treeKill = require("tree-kill");
const path = require("path");
const fs = require("fs");
const sudo = require("sudo-prompt");
const cron = require("node-cron");
const archiver = require("archiver");
// const xssFilters = require("xss-filters");
// const quote = require('shell-quote').quote;

const storage = new store();

let children = [];
let scheduledJobs = [];

ipcMain.handle("get-data", (event) => {
  return new Promise((resolve, reject) => {
    try {
      let database = storage.get("database");
      if (!database) {
        database = { Servers: [] };
        storage.set("database", database);
      }
      console.log("got database: ", database);
      resolve(database.Servers);
    } catch (error) {
      reject(error);
    }
  });
});

ipcMain.handle("save-data", (event, data) => {
  return new Promise((resolve, reject) => {
    try {
      const database = storage.get("database");
      const index = database.Servers.findIndex(
        (server) => server.id === data.id
      );
      if (index === -1 && database && database.Servers)
        database.Servers.push(data);
      else database.Servers[index] = data;
      storage.set("database", database);
      console.log("saved database: ", database);
      resolve(database.Servers);
    } catch (error) {
      reject(error);
    }
  });
});

ipcMain.handle("delete-data", (event, data) => {
  return new Promise((resolve, reject) => {
    try {
      let database = storage.get("database");
      if (!database || !database.Servers) throw "Database not found or empty";
      const index = database.Servers.findIndex(
        (server) => server.id === data.id
      );
      database.Servers.splice(index, 1);
      storage.set("database", database);
      console.log("updated database: ", database);
      resolve(database.Servers);
    } catch (error) {
      reject(error);
    }
  });
});

ipcMain.handle("start-server", (event, server) => {
  return new Promise((resolve, reject) => {
    const child = spawn(server.executable, { detached: true });
    children.push({ pid: child.pid, game: server.game, name: server.name });
    console.log("Spawned child pid: " + child.pid);
    child.on("exit", (code) => {
      if (code == 0 || code == 1 || code == 3221225786)
        console.log("Process exited successfully");
      else
        dialog.showErrorBox(
          `Crash Notification`,
          `${server.game} - ${
            server.name
          } crashed at ${new Date().toLocaleString()}`
        );
    });
    child.stdout.on("data", (data) => console.log(`stdout: ${data}`));
    child.stderr.on("data", (data) => console.error(`stderr: ${data}`));
    child.on("error", (error) => {
      ipcMain.handle("stop-server", server);
      reject(`spawn error: ${error}`);
    });
    child.on("close", (code) => resolve(`child process closed successfully`));
  });
});

ipcMain.handle("stop-server", (event, server) => {
  return new Promise((resolve, reject) => {
    let child = children.find(
      (child) => child.name === server.name && server.game === server.game
    );
    console.log(child);
    if (child) {
      console.log("found child to kill");
      treeKill(child.pid, "SIGTERM", (err) => {
        if (err) console.log(err);
        else
          console.log(
            `Server stopped for ${child.pid} ${child.game} - ${child.name}`
          );
      });
      children.splice(children.indexOf(child), 1);
      resolve(`Server stopped for ${child.pid} ${child.game} - ${child.name}`);
    } else {
      console.log("Did not find child to kill");
      reject("Server not found");
    }
  });
});

ipcMain.handle("execute-script", (event, script) => {
  return new Promise((resolve, reject) => {
    const { name, args } = script;
    const CompletePath = path.join(__dirname, "..", "data", name);
    const CompleteScript = args
      ? `cmd.exe /K ${CompletePath} ${args}`
      : CompletePath;
    console.log("Executing script: ", CompleteScript);

    const options = {
      name: "Electron",
    };

    sudo.exec(CompleteScript, options, (error, stdout, stderr) => {
      if (error) reject(`error: ${error}`);
      else if (stderr) reject(`stderr: ${stderr}`);
      else resolve(`stdout: ${stdout}`);
    });
  });
});

ipcMain.handle("create-schedule", (event, { source, game, time }) => {
  return new Promise((resolve, reject) => {
    console.log("Creating backup schedule for: ", game, time, source);
    const unixTarget = `${os.homedir()}/Documents/EasyGSM/${game}/Backups/`;
    const windowsTarget = `${os.homedir()}\\Documents\\EasyGSM\\${game}\\Backups\\`;
    const target = os.platform() === "win32" ? windowsTarget : unixTarget;
    if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
    const hour = time.split(":")[0];
    const minute = time.split(":")[1];
    const scheduledJob = cron.schedule(`${minute} ${hour} * * *`, () => {
      const output = fs.createWriteStream(`${target}backup.zip`);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", () => {
        console.log(
          `Archived and backed up source directory. Total bytes: ${archive.pointer()}`
        );
      });

      archive.on("error", (err) => {
        reject(err);
      });

      archive.pipe(output);
      archive.directory(source, false);
      archive.finalize();
    });

    console.log(scheduledJob);
    scheduledJob.start();
    scheduledJobs.push({ source, scheduledJob });
    resolve("Successfuly created backup schedule for " + game);
  });
});

ipcMain.handle("delete-schedule", (event, { source, game, time }) => {
  return new Promise((resolve, reject) => {
    console.log("Deleting backup schedule for: ", game, time, source);
    const index = scheduledJobs.findIndex((job) => job.source === source);
    const scheduledJob = scheduledJobs[index]
      ? scheduledJobs[index].scheduledJob
      : null;
    if (scheduledJob)
      console.log("Found backup schedule to delete: ", scheduledJob);
    if (!scheduledJob)
      reject("No backup schedule found for " + game + ". Nothing to delete");
    scheduledJob.stop();
    scheduledJobs.splice(index, 1);
    resolve("Deleted backup schedule for " + game);
  });
});

ipcMain.handle("dialog-box", (event, options) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      type: "warning",
      title: "Irrevocable Action Confirmation",
      buttons: ["Yes", "No"],
      message: "Are you sure you want to continue?",
      detail: "This action cannot be undone.",
    };
    dialog
      .showMessageBox(options ? {...defaultOptions, ...options} : defaultOptions)
      .then((response) => { resolve(response) })
      .catch((error) => reject(error));
  });
});

function createWindow() {
  const bounds = getWindowSettings();
  const window = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    minWidth: 800,
    minHeight: 550,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  window.loadFile(path.join(__dirname, "index.html"));
  window.on("resized", () => saveBounds(window.getBounds()));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

//Make sure the main process validates all incoming IPC maessages to prevent unauthorized or malicious commands from being executed
//If I end up using network communication, make sure I use secure channeles (SSL/TLS)
//Limit permissions to only what is necessary for the renderrer process to perform its tasks
//If the batch scripts use input from the renderer, make sure to sanitize the input to prevent command injection attacks
//Use the latest versions of Electron and IPC libraries and dependencies to ensure the latest security patches are applied
//Implementing proper error handling can prevent an attacker from gaining useful information about the system
//Use code reviews and penn testing

//Possible vulnerabilities:
//Command Injection: If the batch scripts use input from the renderer, they may be able to execute arbitrary commands on the system
//Insecure IPC channels: If the IPC channel is not secured, an attacker might be able to eavesdrop or send unauthorized commands to the main process
//Insufficient Input Validation: If the main process does not properly validate incoming IPC messages, it might execute malicious commands or scripts
//Insecure Dependencies: If the IPC libraries or other dependencies have known vulnerabilities, an attacker might be able to exploit them to compromise the system
//Privilege Escalation: If the renderer process has more permissions than it needs, an attacker who compromises the render process might be able to perform unauthroized actions
//Information Disclosure: If error messages or other outputs from the batch scripts are not handled properly, the might reveal sensitive information about the system
//Lack of updates: If the system is not kept up to date with the latest security patches, it might be vulnerable to known exploits
