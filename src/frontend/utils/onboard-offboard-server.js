/**
 * Creates a backup schedule and, if available, opens the ports listed in the server
 * @param {Object} server A server from the serverList
 * @returns {Object}
 * @param {boolean} ports True if ports opened successfully, false if not
 * @param {boolean} schedule True if schedule created successfully
 */
export const onboardServer = (server) => {
  let result = {};
  const { game, ports, backuptime, saveDirectory } = server;

  window.electron.invoke("create-schedule", {
    source: saveDirectory,
    game: game,
    time: backuptime,
  })
  .then(() => result.schedule = true)
  .catch((error) => result.schedule = error);

  if (!ports) return result;
  window.electron.invoke("execute-script", {
      name: "OpenPorts.bat",
      args: `${game} ${ports.tcpinbound ? ports.tcpinbound + " " : "NA"}${ports.tcpoutbound ? ports.tcpoutbound + " " : "NA"}${ports.udpinbound ? ports.udpinbound + " " : "NA"}${ports.udpoutbound ? ports.udpoutbound : "NA"}`,
  })
  .then(() => (result.ports = true))
  .catch((error) => result.ports = error);

  return result;
};


/**
 * Deletes the backup schedule and, if selected, will delete the open ports in the firewall
 * @param {Object} server A server from the serverList
 * @returns {Object}
 * @param {boolean} ports True if ports opened successfully, false if not
 * @param {boolean} schedule True if schedule created successfully
 */
export const offboardServer = (server, deletePorts) => {
  let result;
  const { game, backuptime, saveDirectory } = server;

  window.electron.invoke("delete-schedule", {
    source: saveDirectory,
    game: game,
    time: backuptime,
  })
  .then(() => (result.schedule = true))
  .catch((error) => result.schedule = error);

  if (!deletePorts) return result;
  window.electron.invoke("execute-script", {
    name: "DeleteOpenPorts.bat",
    args: `${game}`,
  })
  .then(() => (result.ports = true))
  .catch((error) => result.ports = error);

  return result;
};
