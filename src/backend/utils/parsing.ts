export async function parseLogToJSON(logData: any): Promise<any> {
    const events: object[] = [];
    const eventLines: string[] = logData.split('\n\n').map((event: string) => event.trim());

    eventLines.forEach(event => {
        const lines: string[] = event.split('\n').map(line => line.trim());
        const eventData: any = {};
        let currentKey: string = "";

        lines.forEach((line: string) => {
            if (line.includes(':')) {
                const [key, value] = line.split(':').map(part => part.trim());
                if (value) {
                    eventData[key] = value;
                    currentKey = key;
                } else {
                    currentKey = key;
                    eventData[currentKey] = [];
                }
            } else if (currentKey) {
                if (Array.isArray(eventData[currentKey])) {
                    eventData[currentKey].push(line);
                } else {
                    eventData[currentKey] += `\n${line}`;
                }
            }
        });

        events.push(eventData);
    });

    return events;
}