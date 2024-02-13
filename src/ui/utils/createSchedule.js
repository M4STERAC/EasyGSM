const cron = require("node-cron");
const fs = require("fs");
const { createDatePartition } = require("./generalFunctions");
const path = require("path");
const os = require("os");

// Define your source and backup directories
const backupDirectory = "/path/to/backup/directory";

export const createSchedule = (source, game, time) => {
  let target = `${os.homedir()}/Documents/EasyGSM/${game}/Backups/${createDatePartition()}/`;
  const hour = time.split(":")[0];
  const minute = time.split(":")[1];
  cron.schedule(`${minute} ${hour} * * *`, () => {
    fs.readdir(source, (err, files) => {
      if (err) {
        console.error(`Error reading source directory: ${err}`);
        return;
      }

      files.forEach((file) => {
        const sourceFile = path.join(source, file);
        const backupFile = path.join(backupDirectory, file);

        fs.copyFile(sourceFile, backupFile, (err) => {
          if (err) {
            console.error(`Error backing up file ${file}: ${err}`);
          } else {
            console.log(`Backed up file ${file}`);
          }
        });
      });
    });
  });
};
