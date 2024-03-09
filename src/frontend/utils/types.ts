import cron from "node-cron";
import { ReactNode } from "react";
import { Theme } from "@mui/material/styles";

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
    open: string | ReactNode;
    icon: JSX.Element;
    tooltip?: JSX.Element;
}

export interface ConfirmationDialogButton {
    text: string;
    func?: () => any;
}

export interface FormDialogButtons {
    text: string;
    func?: () => boolean;
}

export interface ConfirmationDialogProps {
    title: string;
    buttons: ConfirmationDialogButton[];
    width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    children?: ReactNode;
}

export interface MainCardProps {
    children: ReactNode;
}

export interface FormDialogProps {
    children: ReactNode;
    buttons: FormDialogButtons[];
}