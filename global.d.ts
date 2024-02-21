interface Window {
    electron: {
        invoke: (channel: string, data?: any) => any;
    };
}

interface Server {
    game: string;
    name: string;
    ports: Ports;
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

interface DialogBoxOptions {
    type: "none" | "info" | "error" | "question" | "warning";
    title: string;
    message: string;
    detail: string;
    buttons: string[];
    defaultId: number;
    checkboxLabel: string;
    checkboxChecked: boolean;
    noLink: boolean;
}

interface Schedule {
    source: string;
    game: string;
    time: string;
}