/**
 * Validates a list of IP Addresses to ensure they are in the correct format and within the valid range
 * @param {string} sanitizedBanlist List of IP addresses to validate
 * @returns {true | string} - Returns true if the IP addresses in the string list is valid, returns an error message if it is not
 */
export const validateIpAddress = (sanitizedBanlist) => {
  if (sanitizedBanlist === "") return true;
  const ips = sanitizedBanlist.split(",");
  const regex = new RegExp(/^(\d{1,2}|0\d{0,2}|1\d{0,2}|2[0-4]\d|2[0-5][0-5])\.(\d{1,2}|0\d{0,2}|1\d{0,2}|2[0-4]\d|2[0-5][0-5])\.(\d{1,2}|0\d{0,2}|1\d{0,2}|2[0-4]\d|2[0-5][0-5])\.(\d{1,2}|0\d{0,2}|1\d{0,2}|2[0-4]\d|2[0-5][0-5])$/gm);
  for (let ip of ips) {
    ip = ip.replaceAll(/[^\d\.]/gm, "").trim();
    if (!regex.test(ip)) return `IP Address: ${ip} is not valid. The max value for each octet is 255.`;
  }
  return true;
};


/**
 * Validates a list of ports to ensure they are within the valid range
 * @param {string} sanitizedPorts List of ports to validate
 * @returns {true | string} - Returns true if the ports in the string list is valid, returns an error message if it is not
 */
export const validatePort = (sanitizedPorts) => {
  if (
    sanitizedPorts.tcpinbound === "" &&
    sanitizedPorts.tcpoutbound === "" &&
    sanitizedPorts.udpinbound === "" &&
    sanitizedPorts.udpoutbound === ""
  ) return true;
  const portsArray = Object.values(sanitizedPorts);
  for (let portList of portsArray) {
    const portSplit = portList.split(",");
    for (let port of portSplit) {
      port = port.replaceAll(/[^\d]/gm, "").trim();
      if (+port < 0 || +port > 65535) return `Invalid port ${port}. The max value for a port is 65535.`;
    }
  }
  return true;
};


/**
 * Validates that the unique server id is not already in use
 * @param {string[]} serverList Array of server objects pulled from electron store
 * @param {string} id Generated ID to validate
 * @returns {boolean} - Returns true if the ID is unique, false if it is not
 */
export const checkDuplicateIds = (serverList, id) => {
  const ids = serverList.map((server) => server.id);
  return ids.includes(id);
};


/**
 * Validates that a file path is in the correct format
 * @param {string} sanitizedPath File path to validate
 * @returns {boolean} - Returns true if the path is valid, false if it is not
 */
export const validateFilePath = (sanitizedPath) => {
  if (sanitizedPath === "") return false;
  const unixRegex = new RegExp(/^\/(\/[a-zA-Z0-9-_\(\)\.]+)*$/gm);
  const windowsRegex = new RegExp(/^([A-Z]:)(\\[a-zA-Z0-9\s\(\)-_\.]+)*$/gm);
  const unixResult = unixRegex.test(sanitizedPath);
  const windowsResult = windowsRegex.test(sanitizedPath);
  if (!windowsResult && !unixResult) return false;
  return true;
};


/**
 * Removes anything that isn't a letter, number or a space
 * @param {string} input Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeAlphanumeric = (input) => {
  return input.replaceAll(/[^a-z0-9 ]/gi, "");
};


/**
 * Removes anything that doesn't resemble a filepath
 * @param {string} input Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeFilePath = (input) => {
  //Windows
  if (input.includes('\\')) return input.replaceAll(/[^a-z0-9\s\(\)\._\\:-]/gi, "");
  //Unix
  else return input.replaceAll(/[^a-z0-9\s\(\)\._/-]/gi, "");
};


/**
 * Removes anything that isn't a number, comma or a space
 * @param {string} input Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizePorts = (input) => {
  return input.replaceAll(/[^0-9,\s]/gi, "");
};


/**
 * Removes anything that isn't a number, comma, period or a space
 * @param {string} input Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeIpAddress = (input) => {
  return input.replaceAll(/[^0-9.,\s]/gi, "");
};