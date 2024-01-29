import { FilterEvents } from '../src/CrashEventFilter';

describe('Happy Path', () => {
    test('FilterEvents', async () => {
        let response: any = await FilterEvents();
        expect(response).toBeDefined;
        expect(response.statusCode).toBe(200);
        expect(response.PalServerErrorLogs.length).toBeGreaterThan(0);
    }, 100);
});