interface Window {
    electron: any;
}

interface Server {
    game: string;
    name: string;
    backuptime: string;
    saveDirectory: string;
    executable: string;
    id: string;
    lastrestart: string;
    status: string;
    banlist: string;
    ports: Ports;
    uptime: number;
    players: number;
    pid: number | string;
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

interface DialogBoxRespone {
    response: number;
    checkboxChecked: boolean;
}

interface Schedule {
    source: string;
    game: string;
    time: string;
}