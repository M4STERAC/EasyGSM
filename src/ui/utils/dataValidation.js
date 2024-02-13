export const validateIpAddress = (banlist) => {
  if (banlist === "") return true;
  let error = "";
  const ips = banlist.split(",");
  const regex = new RegExp(
    /^(\d{1,2}|0\d{0,2}|1\d{0,2}|2[0-4]\d|2[0-5][0-5])\.(\d{1,2}|0\d{0,2}|1\d{0,2}|2[0-4]\d|2[0-5][0-5])\.(\d{1,2}|0\d{0,2}|1\d{0,2}|2[0-4]\d|2[0-5][0-5])\.(\d{1,2}|0\d{0,2}|1\d{0,2}|2[0-4]\d|2[0-5][0-5])$/gm
  );
  for (let ip of ips) {
    ip = ip.replaceAll(/[^\d\.]/gm, "").trim();
    if (!regex.test(ip)) {
      error = `IP Address: ${ip} is not valid. The max value for each octet is 255.`;
      break;
    } else {
      console.log("IP Address: " + ip + " is valid");
      error = "";
    }
  }
  return error === "" ? true : error;
};

export const validatePort = (ports) => {
  let error = "";
  if (
    ports.tcpinbound === "" &&
    ports.tcpoutbound === "" &&
    ports.udpinbound === "" &&
    ports.udpoutbound === ""
  )
    return true;
  else {
    const portsArray = Object.values(ports);
    for (let portList of portsArray) {
      const portSplit = portList.split(",");
      for (let port of portSplit) {
        port = port.replaceAll(/[^\d]/gm, "").trim();
        console.log(`Port ${port} is being validated`);
        if (+port < 0 || +port > 65535) {
          error = `Invalid port ${port}. The max value for a port is 65535.`;
          return error;
        } else {
          console.log(`Port: ${port} is valid`);
          error = "";
        }
      }
    }
    return error === "" ? true : error;
  }
};

export const checkDuplicateIds = (serverList, id) => {
  console.log(`Checking for duplicate id: ${id}`);
  const ids = serverList.map((server) => server.id);
  const result = ids.includes(id);
  console.log(
    `Result: ${result ? "Found a" : "Did not find a"} duplicate id for ${id}`
  );
  return ids.includes(id);
};

export const validateFilePath = (sanitizedPath) => {
  console.log(`Path ${sanitizedPath} is being validated`);
  if (sanitizedPath === "") return false;
  const unixRegex = new RegExp(/^\/(\/[a-zA-Z0-9-_\(\)\.]+)*$/gm);
  const windowsRegex = new RegExp(/^([A-Z]:)(\\[a-zA-Z0-9\s\(\)-_\.]+)*$/gm);
  const unixResult = unixRegex.test(sanitizedPath);
  const windowsResult = windowsRegex.test(sanitizedPath);
  if (!windowsResult && !unixResult) {
    console.log(
      `Path ${sanitizedPath} is not a valid Unix or Windows file path`
    );
    return false;
  }
  return true;
};

export const sanitizeAlphanumeric = (input) => {
  return input.replaceAll(/[^a-z0-9 ]/gi, "");
};

export const sanitizeFilePath = (input) => {
  return input.replaceAll(/[^a-z0-9\s\(\)\._\\:-]/gi, "");
};

export const sanitizePorts = (input) => {
  return input.replaceAll(/[^0-9,\s]/gi, "");
};

export const sanitizeIpAddress = (input) => {
  return input.replaceAll(/[^0-9.,\s]/gi, "");
};