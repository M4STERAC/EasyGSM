import { parseLogToJSON } from '../utils/functions';
import { getData } from '../utils/functions';

describe('Happy Path', () => {
    test('parseLogToJSON', async () => {
        let data: string = await getData('C:\\temp\\PalWorldServerCrashLog.txt');
        let results: any = await parseLogToJSON(data);
        expect(results).toBeDefined;
    }, 10);
});