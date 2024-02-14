export const onboardServer = (server) => {
  let result = {};
  const { game, ports, backuptime, saveDirectory } = server;

  console.log("Onboarding Server: ", server);
  if (ports) {
    console.log("Opening Ports: ", ports);
    window.electron
      .invoke("execute-script", {
        name: "OpenPorts.bat",
        args: `${game} ${ports.tcpinbound ? ports.tcpinbound + " " : "NA"}${ports.tcpoutbound ? ports.tcpoutbound + " " : "NA"}${ports.udpinbound ? ports.udpinbound + " " : "NA"}${ports.udpoutbound ? ports.udpoutbound : "NA"}`,
      })
      .then(() => console.log("Success"))
      .then(() => (result.ports = true))
      .catch((error) => {
        console.error("Error opening ports: ", error);
        result.ports = error;
      });
  }

  console.log("Creating Backup Schedule: ", game, backuptime, saveDirectory);
  window.electron
    .invoke("create-schedule", {
      source: saveDirectory,
      game: game,
      time: backuptime,
    })
    .then((data) => console.log(data))
    .catch((error) => console.error("Create Schedule Error: ", error));

  return result;
};

export const offboardServer = (server, deletePorts) => {
  let result;
  const { game, backuptime, saveDirectory } = server;

  console.log("Offboarding Server: ", server);
  console.log("Closing Ports for game: ", game);
  if (deletePorts) {
    window.electron
      .invoke("execute-script", {
        name: "DeleteOpenPorts.bat",
        args: `${game}`,
      })
      .then(() => console.log("Success"))
      .then(() => (result.ports = true))
      .catch((error) => {
        console.error("Error closing ports: ", error);
        result.ports = error;
      });
  }

  console.log("Deleting Backup Schedule for game: ", game);
  window.electron
    .invoke("delete-schedule", {
      source: saveDirectory,
      game: game,
      time: backuptime,
    })
    .then((message) => console.log(message))
    .then(() => (result.schedule = true))
    .catch((error) => {
      console.error("Error deleting backup schedule: ", error);
      result.schedule = error;
    });

  return result;
};
