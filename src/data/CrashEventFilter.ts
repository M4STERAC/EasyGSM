import * as fs from "fs";
import { parseLogToJSON } from "./utils/parsing";
import * as os from "os";

export async function FilterEvents(game: string) {
  let path = `C:\\temp\\EasyGSM\\${game}-CrashLog.txt`;
  let logs: string;
  let logJSON: any[];
  let attempt = 0;

  while (true) {
    try {
      let logsBuffer: Buffer = fs.readFileSync(path);
      logs = logsBuffer.toString("utf-8");
      logJSON = await parseLogToJSON(logs);
      break;
    } catch (err) {
      if (attempt > 3) throw err;
      else attempt++;
    }
  }
  if (logs && logJSON.length === 0) throw `Failed to parse logs into JSON`;
  const regex: RegExp = new RegExp(game, "gi");
  const ErrorLogs = logJSON.filter((log) => { return regex.test(log.P1) });
  fs.writeFileSync(
    `${os.homedir()}\\Documents\\EasyGSM\\${game}\\logs\\error\\${game}-ErrorLogs.json`,
    JSON.stringify(ErrorLogs)
  );
  return { statusCode: 200, ErrorLogs };
}
