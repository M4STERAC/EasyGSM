import cron from "node-cron";
import { ReactNode } from "react";

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

export interface GetData {
    storageName: string;
    defaultValue: any;
}

export interface MenuListItem {
    text: string;
    link: string;
    icon: JSX.Element;
    tooltip?: JSX.Element;
}

export interface PopUpBoxSize {
    width: number;
    height: number;
}

export interface PopUpBoxProps {
    size: PopUpBoxSize;
    children: ReactNode;
}