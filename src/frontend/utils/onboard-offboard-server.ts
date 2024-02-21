/**
 * Creates a backup schedule and, if available, opens the ports listed in the server
 * @param {Server} server A server from the serverList
 * @returns {OnOffboardServerResult}
 */
import { OnOffboardServerResult } from './types';

export const onboardServer = (server: Server): OnOffboardServerResult => {
  let result: OnOffboardServerResult = { ports: false, schedule: false };
  const { game, ports, backuptime, saveDirectory } = server;

  window.electron.invoke("create-schedule", {
    source: saveDirectory,
    game: game,
    time: backuptime,
  })
  .then(() => result.schedule = true)
  .catch((error: string) => result.schedule = error);

  if (!ports) return result;
  window.electron.invoke("execute-script", {
      name: "OpenPorts.bat",
      args: `${game} ${ports.tcpinbound ? ports.tcpinbound + " " : "NA"}${ports.tcpoutbound ? ports.tcpoutbound + " " : "NA"}${ports.udpinbound ? ports.udpinbound + " " : "NA"}${ports.udpoutbound ? ports.udpoutbound : "NA"}`,
  })
  .then(() => (result.ports = true))
  .catch((error: string) => result.ports = error);

  return result;
};


/**
 * Deletes the backup schedule and, if selected, will delete the open ports in the firewall
 * @param {Server} server A server from the serverList
 * @param {boolean} deletePorts If true, will delete the open ports in the firewall, will not otherwise
 * @returns {OnOffboardServerResult}
 */
export const offboardServer = (server: Server, deletePorts: boolean): OnOffboardServerResult => {
  let result: OnOffboardServerResult = { ports: false, schedule: false };
  const { game, backuptime, saveDirectory } = server;

  window.electron.invoke("delete-schedule", {
    source: saveDirectory,
    game: game,
  })
  .then(() => (result.schedule = true))
  .catch((error: string) => result.schedule = error);

  if (!deletePorts) return result;
  window.electron.invoke("execute-script", {
    name: "DeleteOpenPorts.bat",
    args: `${game}`,
  })
  .then(() => (result.ports = true))
  .catch((error: string) => result.ports = error);

  return result;
};
