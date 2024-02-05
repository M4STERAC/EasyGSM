import * as fs from "fs";
import { parseLogToJSON } from "./utils/parsing";
import * as os from "os";

export async function FilterEvents() {
  let path = "C:\\temp\\EasyGSM\\PalWorldServerCrashLog.txt";
  let logs = void 0;
  let logJSON = void 0;
  let attempt = 0;

  while (true) {
    try {
      let logsBuffer = fs.readFileSync(path);
      logs = logsBuffer.toString("utf-8");
      logJSON = await parseLogToJSON(logs);
      break;
    } catch (err) {
      if (attempt > 3) throw err;
      else attempt++;
    }
  }
  if (logs && logJSON.length === 0) throw `Failed to parse logs into JSON`;
  const PalServerErrorLogs = logJSON.filter((log) => { return /PalSer\w{0,3}.{0,19}/gi.test(log.P1) });
  fs.writeFileSync(
    `${os.homedir()}\\Documents\\EasyGSM\\PalServer\\logs\\error\\PalServerErrorLogs.json`,
    JSON.stringify(PalServerErrorLogs)
  );
  return { statusCode: 200, PalServerErrorLogs };
}
