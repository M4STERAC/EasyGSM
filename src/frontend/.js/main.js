/**
 * Main script file for the EasyGSM application.
 * Handles the main Electron process, IPC communication, database operations, server management, and backup scheduling.
 * @module main
 */
const { saveBounds, getWindowSettings } = require("./settings.js");
const { ipcMain, dialog, app, BrowserWindow } = require("electron");
const store = require("electron-store");
const os = require("os");
const { spawn } = require("child_process");
const treeKill = require("tree-kill");
const path = require("path");
const fs = require("fs");
const sudo = require("sudo-prompt");
const cron = require("node-cron");
const archiver = require("archiver");
const log = require('electron-log/main');
const AdmZip = require('adm-zip');


//Initialize electron store
const storage = new store();


//Global variables
let children = [];
let scheduledJobs = [];




//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Electron Settings

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function createWindow() {
  const bounds = getWindowSettings();
  const window = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    minWidth: 800,
    minHeight: 800,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: true,
    },
  });
  //Loads the index.html file into the window. index.html will load React
  window.loadFile(path.join(__dirname, '..', "index.html"));

  //When the window is resized, save the bounds to electron store for persistence
  window.on("resized", () => saveBounds(window.getBounds()));
}


app.whenReady().then(createWindow).then(() => log.info("EasyGSM Opened"));
app.on("window-all-closed", function () {
  log.info("EasyGSM Closed\n");
  if (process.platform !== "darwin") app.quit();
});






//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//IPC Handlers

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




/**
 * Handles the "get-data" IPC message to retrieve the server data from electron store (the database), save it to electron store for persistence, and return it to the renderer.
 * @returns {Promise} A promise that resolves with the server data from the database.
 */
ipcMain.handle("get-data", (event, { storageName, defaultValue }) => {
  return new Promise((resolve, reject) => {
    try {
      let data = storage.get(storageName);
      if (!data && defaultValue) storage.set(storageName, defaultValue);
      resolve(data ? data : defaultValue);
    } catch (error) { 
      reject(error); 
    }
  });
});


/**
 * Handles the "save-data" IPC message to save the server data to electron store (the database) and return the updated server data to the renderer.
 * @param {Object} data - The server data object to save to the database.
 * @returns {Promise} A promise that resolves with the updated server data from the database.
 */
ipcMain.handle("save-server", (event, data) => {
  return new Promise((resolve, reject) => {
    try {
      let database = storage.get("database");
      if (!database || !database.Servers || database.Servers.length === 0) {
        database = { Servers: [] };
        storage.set("database", database);
      }
      const index = database.Servers.findIndex((server) => server.id === data.id);
      if (index === -1 && database && database.Servers) database.Servers.push(data);
      else database.Servers[index] = data;
      storage.set("database", database);
      log.info(`Server { ID: ${database.id} Game: ${database.game} Name: ${database.name} } has been created/updated`);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
});


/**
 * Handles the "save-data" IPC message to save misc data to electron store (the database) and return a message.
 * @returns {string} A message indicating the success or error of the data save operation.
 */
ipcMain.handle("save-data", (event, { storageName, data }) => {
  return new Promise((resolve, reject) => {
    try {
      storage.set(storageName, data);
      resolve("Success");
    } catch (error) {
      reject(error);
    }
  });
});


/**
 * Handles the "delete-data" IPC message to delete the server data from electron store (the database) and return the updated server list to the renderer.
 * @param {Object} data - The server data object to delete from the database.
 * @returns {Promise} A promise that resolves with the updated server list from the database.
 */
ipcMain.handle("delete-server", (event, data) => {
  return new Promise((resolve, reject) => {
    try {
      let database = storage.get("database");
      if (!database || !database.Servers) throw "Database not found or empty";
      const index = database.Servers.findIndex((server) => server.id === data.id);
      database.Servers.splice(index, 1);
      storage.set("database", database);
      log.info(`Server { ID: ${data.id} } has been deleted`);
      resolve(`Server { ID: ${data.id} } has been deleted`);
    } catch (error) {
      log.error(`Delete Server Error: ${error}`);
      reject(error);
    }
  });
});


/**
 * Handles the "get-servers" IPC message create a subprocess and execute a server executable.
 * @param {Object} server - The server object containing the executable path and game name.
 * @returns {Promise} A promise that resolves with a message depending on user action with the executed server application.
 */
ipcMain.handle("start-server", (event, server) => {
  return new Promise((resolve) => {
    let closedServerId;
    const startChildProcess = (firstSpawn = true) => {
      let child = spawn(server.executable, { detached: false });
      if (firstSpawn) child.id = server.id; 
      else child.id = closedServerId;
      children.push(child);
      console.log('CHILDREN IDs: ', children.map(child => {return { id: child.id, pid: child.pid }}));
      
      child.stdout.on("data", (data) => console.debug(`stdout: ${data}`));
      child.stderr.on("data", (data) => console.error(`stderr: ${data}`));
      
      child.on("close", () => {
        closedServerId = child.id;
        console.log(`Closed Server ID: ${closedServerId}`);
        
        if (children[(children.length - 1)] !== 'STOP') {
          const index = children.findIndex(el => el.id == child.id);
          if (index > -1) {
            children.splice(index, 1);
            console.log('Removed child');
          } else {
            console.log('No child to remove on restart');
          }
        }
        
        if (children[(children.length - 1)] !== 'STOP') {
          startChildProcess(false);
        } else {
          children.pop();
        }
      });
      
      child.on("error", () => {
        closedServerId = child.id;
        console.log(`Closed Server ID: ${closedServerId}`);
        
        if (children[(children.length - 1)] !== 'STOP') {
          const index = children.findIndex(el => el.id == child.id);
          if (index !== -1) {
            children.splice(index, 1);
            console.log('Removed child');
          } else {
            console.log('No child to remove on restart');
          }
        }
        
        if (children[(children.length - 1)] !== 'STOP') {
          startChildProcess(false);
        } else {
          children.pop();
        }
      });
    };

    startChildProcess();
    console.log('Resolved');
    resolve();
  });
});


/**
 * Handles the "stop-server" IPC message to stop a server process by sending a SIGTERM signal to the child process.
 * @param {Object} server - The server object containing the name and game name of the server to stop.
 * @returns {Promise} A promise that resolves with a message indicating the success or failure of the server stop action.
 */
ipcMain.handle("stop-server", (event, server) => {
  return new Promise((resolve, reject) => {
    console.log('SERVER TO STOP: ', server.id);
    children.push('STOP');
    let child = children.find((child) => child.id == server.id);
    if (!child) reject("Server not found");
    console.log('CHILD TO STOP: ', child);
    console.log('CHILDREN IDs: ', children.map(child => {return { id: child.id, pid: child.pid }}));
    treeKill(child.pid, "SIGTERM", (err) => {
      if (err) {
        log.error(`Failed to kill child process: ${err}`);
        children.pop();
        reject('Failed to stop server. Please close the program manually.');
      }
      else children.splice(children.indexOf(child), 1);
    });
    log.info(`Stopped server with PID: ${child.pid} and ${child.id}`);
    resolve(`Stopped server with PID: ${child.pid} and ${child.id}`);
  });
});


/**
 * Handles the "execute-script" IPC message to execute a batch script with elevated privileges using sudo-prompt.
 * @param {Object} script - The script object containing the name of the script and any arguments to pass to it.
 * @returns {Promise} A promise that resolves with the output of the executed script or rejects with an error message.
 */
ipcMain.handle("execute-script", (event, script) => {
  return new Promise((resolve, reject) => {
    const { name, args } = script;
    const CompletePath = path.join(__dirname, "..", "backend", name);
    const CompleteScript = args ? `cmd.exe /K ${CompletePath} ${args}` : CompletePath;
    const options = { name: "Electron" };

    //Privilege Escalation: If the renderer process has more permissions than it needs, 
    //an attacker who compromises the render process might be able to perform unauthroized actions
    log.info(`Executing script: ${CompleteScript}`);
    sudo.exec(CompleteScript, options, (error, stdout, stderr) => {
      if (error) {
        log.error(`Error executing script: ${error}`);
        reject(`error: ${error}`);
      }
      else if (stderr) {
        log.error(`Error executing script: ${stderr}`);
        reject(`stderr: ${stderr}`);
      }
      else {
        log.info(`${name} Script: ${stdout}`);
        resolve(`stdout: ${stdout}`);
      }
    });
  });
});


/**
 * Handles the "create-schedule" IPC message to create a backup schedule using node-cron and archiver.
 * @param {Object} schedule - The schedule object containing the required data for the backup schedule.
 * @property {string} source - The source directory to backup.
 * @property {string} game - The game name for the backup schedule.
 * @property {string} time - The time to schedule the backup.
 * @returns {Promise} A promise that resolves with a message indicating the success or failure of the backup schedule creation.
 */
ipcMain.handle("create-schedule", (event, { source, game, time }) => {
  return new Promise((resolve, reject) => {
    const unixTarget = `${os.homedir()}/Documents/EasyGSM/${game}/Backups/`;
    const windowsTarget = `${os.homedir()}\\Documents\\EasyGSM\\${game}\\Backups\\`;
    const target = os.platform() === "win32" ? windowsTarget : unixTarget;
    if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
    const hour = time.split(":")[0];
    const minute = time.split(":")[1];
    const scheduledJob = cron.schedule(`${minute} ${hour} * * *`, () => {
      const output = fs.createWriteStream(`${target}backup.zip`);
      const archive = archiver("zip", { zlib: { level: 9 } });
      output.on("close", () => console.log(`Archived and backed up source directory. Total bytes: ${archive.pointer()}`));
      archive.on("error", (err) => reject(err));
      archive.pipe(output);
      archive.directory(source, false);
      archive.finalize();
    });
    scheduledJob.start();
    scheduledJobs.push({ source, scheduledJob });
    log.info(`Created backup schedule for ${game}`);
    resolve(`Successfuly created backup schedule for ${game}`);
  });
});


/**
 * Handles the "delete-schedule" IPC message to delete a backup schedule using node-cron.
 * @param {Object} schedule - The schedule object containing the required data for the backup schedule.
 * @property {string} source - The source directory to backup.
 * @property {string} game - The game name for the backup schedule.
 * @property {string} time - The time to schedule the backup.
 * @returns {Promise} A promise that resolves with a message indicating the success or failure of the backup schedule deletion.
 */
ipcMain.handle("delete-schedule", (event, { source, game }) => {
  return new Promise((resolve, reject) => {
    const index = scheduledJobs.findIndex((job) => job.source === source);
    const scheduledJob = scheduledJobs[index] ? scheduledJobs[index].scheduledJob : null;
    if (!scheduledJob) reject("No backup schedule found for " + game + ". Nothing to delete");
    scheduledJob.stop();
    scheduledJobs.splice(index, 1);
    log.info(`Deleted backup schedule for ${game}`);
    resolve(`Deleted backup schedule for ${game}`);
  });
});


/**
 * Handles the "dialog-box" IPC message to display a dialog box with the specified options.
 * @param {Object} options - The options object for the dialog box.
 * @property {string} type - none, info, error, question, or warning.
 * @property {string} title - The title of the dialog box.
 * @property {string} message - The message to display in the dialog box.
 * @property {string} detail - The detail message to display in the dialog box.
 * @property {string[]} buttons - The buttons to display in the dialog box.
 * @property {string} defaultId - The index of the button that should be focused by default.
 * @property {string} checkboxLabel - The label for the checkbox in the dialog box.
 * @property {boolean} checkboxChecked - Whether the checkbox in the dialog box should be checked by default.
 * @property {boolean} noLink - Whether to disable the hyperlink style for the dialog message.
 * @returns {Promise} A promise that resolves with the index of the button that was clicked.
 */
ipcMain.handle("dialog-box", (event, options) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      type: "warning",
      title: "Irrevocable Action Confirmation",
      buttons: ["Yes", "No"],
      message: "Are you sure you want to continue?",
      detail: "This action cannot be undone.",
      defaultId: 1,
    };
    dialog.showMessageBox({...defaultOptions, ...options})
      .then((response) => { resolve(response) })
      .catch((error) => {
        log.error(`Dialog Box Error: ${error}`);
        reject(error);
      });
  });
});

ipcMain.on("app/close", () => {
  app.quit();
  log.info("EasyGSM Closed");
});

ipcMain.on("app/minimize", () => {
  const window = BrowserWindow.getFocusedWindow();
  window.minimize();
});

ipcMain.on("app/maximize", () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window.isMaximized()) window.unmaximize();
  else window.maximize();
});

ipcMain.on("install-dependencies", () => {
  const dependencies = [{ name: 'SteamCMD', uri: 'https://steamcdn-a.akamaihd.net/client/installer/steamcmd.zip' }];
  const dependenciesPath = `${os.homedir()}\\Documents\\EasyGSM\\dependencies`;
  if (!fs.existsSync(dependenciesPath)) {
    fs.mkdirSync(dependenciesPath, { recursive: true });
    log.info('Dependencies directory created');
  }


  //Download and extract dependencies
  for (const dependency of dependencies) { 
    if (fs.existsSync(`${dependenciesPath}\\${dependency.name}`)) continue;
    fs.mkdirSync(`${dependenciesPath}\\${dependency.name}`, { recursive: true });
    log.info(`Created directory for ${dependency.name}`);
    log.info(`Downloading ${dependency.name} from ${dependency.uri} to ${dependenciesPath}\\${dependency.name}\\${dependency.name}.zip`);
    //Download dependency
    const curl = spawn("curl", ["-L", "-o", `${dependenciesPath}\\${dependency.name}\\${dependency.name}.zip`, dependency.uri]);
    curl.stdout.on("data", (data) => console.debug(`stdout: ${data}`));
    curl.stderr.on("data", (data) => console.error(`stderr: ${data}`));
    curl.on("close", () => {
      log.info(`Downloaded ${dependency.name}`);
      //Extract dependency
      const zip = new AdmZip(`${dependenciesPath}\\${dependency.name}\\${dependency.name}.zip`);
      zip.extractAllTo(`${dependenciesPath}\\${dependency.name}\\`, true);
      fs.unlinkSync(`${dependenciesPath}\\${dependency.name}\\${dependency.name}.zip`);
      log.info(`Extracted ${dependency.name}`);
      //Install dependency
      log.info(`Installing ${dependenciesPath}\\${dependency.name}\\${dependency.name}.exe`);
      const cmd = spawn(`${dependenciesPath}\\${dependency.name}\\${dependency.name}.exe`, [], { shell: true, detached: true });
      cmd.stdout.on('data', (data) => console.log(`stdout: ${data}`));
      cmd.stderr.on("data", (data) => console.error(`stderr: ${data}`));
      cmd.on("close", () => log.info(`Installed ${dependency.name}`));
    });
  }
});