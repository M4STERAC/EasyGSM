import * as fs from 'fs';

export async function getData(path: string) {
    let attempt: number = 0;
    let logs: any;

    while (true) {
        try { 
            let logsBuffer: Buffer = fs.readFileSync(path);
            logs = logsBuffer.toString('utf-8');
            break;
        }
        catch (err) { 
            attempt++;
            if (attempt > 3) throw `Failed to get logs from ${path}`;
            console.error('Failed to get logs. Retrying...');
        }
    }
    if(!logs) throw 'Log file is empty';
    return logs;
}