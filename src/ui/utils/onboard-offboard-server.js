export const onboardServer = (server) => {
  let result = {};
  const { game, ports, backupTime, saveDirectory } = server;

  console.log("Onboarding Server: ", server);
  if (ports) {
    console.log("Opening Ports: ", ports);
    window.electron
      .invoke("execute-script", {
        name: "OpenPorts.bat",
        args: `${game} ${ports.tcpinbound ? ports.tcpinbound + " " : ""}${ports.tcpoutbound ? ports.tcpoutbound + " " : ""}${ports.udpinbound ? ports.udpinbound + " " : ""}${ports.udpoutbound ? ports.udpoutbound : ""}`,
      })
      .then(() => console.log('Success'))
      .then(() => (result.ports = true))
      .catch((error) => {
        console.error("Error opening ports: ", error);
        result.ports = error;
      });
  }

  console.log("Creating Backup Schedule: ", game, backupTime, saveDirectory);
  window.electron
    .invoke("execute-script", {
      name: "CreateBackupSchedule.bat",
      args: `${game} ${backupTime} ${saveDirectory}`,
    })
    .then(() => console.log('Success'))
    .then(() => (result.schedule = true))
    .catch((error) => {
      console.error("Error creating backup schedule: ", error);
      result.schedule = error;
    });

  return result;
};

export const offboardServer = (server) => {
  let result;
  const { game, name } = server;

  console.log("Offboarding Server: ", server);
  console.log("Closing Ports for game: ", game);
  window.electron
    .invoke("execute-script", {
      name: "DeleteOpenPorts.bat",
      args: `${game}`,
    })
    .then(() => console.log('Success'))
    .then(() => (result.ports = true))
    .catch((error) => {
      console.error("Error closing ports: ", error);
      result.ports = error;
    });

  console.log("Deleting Backup Schedule for game: ", game);
  window.electron
    .invoke("execute-script", {
      name: "DeleteBackupSchedule.bat",
      args: `${name}`,
    })
    .then(() => console.log('Success'))
    .then(() => (result.schedule = true))
    .catch((error) => {
      console.error("Error deleting backup schedule: ", error);
      result.schedule = error;
    });

  return result;
};
