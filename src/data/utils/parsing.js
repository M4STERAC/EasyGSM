export async function parseLogToJSON(logData) {
    const events = [];
    const eventLines = logData.split('\n\n').map(event => event.trim());

    eventLines.forEach(event => {
        const lines = event.split('\n').map(line => line.trim());
        const eventData = {};
        let currentKey = "";

        lines.forEach(line => {
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