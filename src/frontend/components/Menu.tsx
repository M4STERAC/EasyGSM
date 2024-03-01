import React, { useState, useContext } from 'react';
import { StoreContext } from "../Store";


//Custom
import MenuItem from './MenuItem';
import { MenuListItem } from "../utils/types";
import "../css/Menu.css";


//MUI Items
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';


//MUI Icons
import MailIcon from '@mui/icons-material/Mail';
import BugReportIcon from '@mui/icons-material/BugReport';
import PolicyIcon from '@mui/icons-material/Policy';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import License from './License';


const topItems: MenuListItem[] = [
    { text: 'Home', open: '', icon: <MailIcon />},
    { text: 'About', open: '', icon: <MailIcon />},
    { text: 'License', open: <License />, icon: <PolicyIcon />},
    { text: 'Settings', open: '', icon: <MailIcon />},
    { text: 'Report Issue', open: 'https://github.com/M4STERAC/EasyGSM/issues/new', icon: <BugReportIcon />},
];
const bottomItems: MenuListItem[] = [
    { text: 'View Source Code', open: 'https://github.com/M4STERAC/EasyGSM', icon: <CodeIcon />},
    { text: 'Contribute', open: '', icon: <GitHubIcon />},
    { text: 'Contact', open: '', icon: <MailIcon />},
    { text: 'Donate', open: '', icon: <AttachMoneyIcon />}
];


const Menu = () => {
    const [state, setState] = useContext(StoreContext);
    const theme = useTheme();


    return (
        <Drawer anchor="left" open={state.menuOpen} onClose={() => setState((prevState: any) => ({ ...prevState, menuOpen: false }))} sx={{
            backgroundColor: theme.palette.background.default,
        }}>
        {topItems.map((item, index) => (
            <MenuItem key={index} item={item} onClick={() => setState((prevState: any) => ({ ...prevState, menuOpen: false }))}/>
        ))}

        <Divider />

        {bottomItems.map((item, index) => (
            <MenuItem key={index} item={item} />
        ))}
        </Drawer>
    );
};

export default Menu;