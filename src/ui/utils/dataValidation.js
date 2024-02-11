export const validateIpAddress = (ip) => {
  console.log(`IP Address ${ip} is being validated`);
  if (ip === "") return true;
  const regex = new RegExp(
    /^(\d{1,2}|0\d{0,2}|1\d{0,2}|2[0-4]\d|2[0-5][0-5])\.(\d{1,2}|0\d{0,2}|1\d{0,2}|2[0-4]\d|2[0-5][0-5])\.(\d{1,2}|0\d{0,2}|1\d{0,2}|2[0-4]\d|2[0-5][0-5])\.(\d{1,2}|0\d{0,2}|1\d{0,2}|2[0-4]\d|2[0-5][0-5])$/gm
  );
  const result = regex.test(ip);
  return result;
};

export const validatePort = (port) => {
  console.log(`Port ${port} is being validated`);
  if (port === "") return true;
  const regex = new RegExp(/^([1-9]|\d{2,4}|6[0-5][0-5][0-3][0-5])$/gm);
  const result = regex.test(port);
  return result;
}

export const checkDuplicateIds = (serverList, id) => {
  console.log(`Checking for duplicate id: ${id}`);
  const ids = serverList.map((server) => server.id);
  const result = ids.includes(id);
  console.log(`Result: ${result ? "Found a" : "Did not find a"} duplicate id for ${id}`);
  return ids.includes(id);
}