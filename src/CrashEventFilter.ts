import * as fs from "fs";
import { getData, parseLogToJSON } from "../utils/functions";
import * as os from "os";

export async function FilterEvents() {
  let path: string = "C:\\temp";
  let logs: any = await getData(`${path}\\PalWorldServerCrashLog.txt`);
  let logJSON: any = await parseLogToJSON(logs);
  const PalServerErrorLogs: any = logJSON.filter((log: any) => {
    return /PalSer\w{0,3}.{0,19}/gi.test(log.P1);
  });
  fs.writeFileSync(
    `${os.homedir()}\\Documents\\PalServerErrorLogs.json`,
    JSON.stringify(PalServerErrorLogs)
  );
  return { statusCode: 200, PalServerErrorLogs };
}
