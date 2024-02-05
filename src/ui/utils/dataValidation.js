export const validateIpAddress = (ip) => {
  console.log(ip);
  const regex = new RegExp(
    "^(d{0,2}|0d{0,2}|1d{0,2}|2[0-4]d|2[0-5][0-5]).(d{0,2}|0d{0,2}|1d{0,2}|2[0-4]d|2[0-5][0-5]).(d{0,2}|0d{0,2}|1d{0,2}|2[0-4]d|2[0-5][0-5]).(d{0,2}|0d{0,2}|1d{0,2}|2[0-4]d|2[0-5][0-5])$"
  );
  return regex.test(ip);
};
