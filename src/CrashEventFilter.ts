import * as fs from "fs";
import { getData, parseLogToJSON } from "../utils/functions";
import * as os from "os";

export async function FilterEvents() {
  let path: string = "C:\\temp";
  let logs: any = void 0;
  let logJSON: any = void 0;
  let attempt: number = 0;

  while (true) {
    try {
      logs = await getData(`${path}\\PalWorldServerCrashLog.txt`);
      logJSON = await parseLogToJSON(logs);
      break;
    } catch (err) {
      if (attempt > 3) throw err;
      else attempt++;
    }
  }
  if(logs && logJSON.length === 0) throw `Failed to parse logs into JSON`;
  const PalServerErrorLogs: any = logJSON.filter((log: any) => {
    return /PalSer\w{0,3}.{0,19}/gi.test(log.P1);
  });
  fs.writeFileSync(
    `${os.homedir()}\\Documents\\PalServerErrorLogs.json`,
    JSON.stringify(PalServerErrorLogs)
  );
  return { statusCode: 200, PalServerErrorLogs };
}
