import { getData } from '../utils/functions';

describe('Happy Path', () => {
    test('parseLogToJSON', async () => {
        let results: any = await getData('C:\\temp\\PalWorldServerCrashLog.txt');
        expect(results).toBeDefined;
    }, 10);
});