interface Window {
    electron: {
        invoke: (channel: string, data: any) => any;
    };
}

interface Server {
    game: string;
    name: string;
    ports: ports;
    backuptime: string;
    saveDirectory: string;
    executable: string;
    id: string;
}

interface Ports {
    tcpinbound: string;
    tcpoutbound: string;
    udpinbound: string;
    udpoutbound: string;
}