import cron from "node-cron";

export interface OnOffboardServerResult {
    ports: boolean | string;
    schedule: boolean | string;
}

export interface Bounds {
    width: number;
    height: number;
}

export interface Child {
    pid: number, 
    game: string, 
    name: string 
}

export interface Script {
    name: string;
    args: string;
}

export interface ScheduledJobs {
    source: string;
    scheduledJob: cron.ScheduledTask;
}

export interface Error {
    banlistError: string;
    portError: string;
    pathError: string;
    requiredFieldsError: string;
}