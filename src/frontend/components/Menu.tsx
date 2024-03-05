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
import Box from '@mui/material/Box';


//MUI Icons
import MailIcon from '@mui/icons-material/Mail';
import BugReportIcon from '@mui/icons-material/BugReport';
import PolicyIcon from '@mui/icons-material/Policy';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import License from './License';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';


const topItems: MenuListItem[] = [
    { text: 'Home', open: '', icon: <HomeIcon />},
    { text: 'About', open: '', icon: <InfoIcon />},
    { text: 'License', open: <License />, icon: <PolicyIcon />},
    { text: 'Report Issue', open: 'https://github.com/M4STERAC/EasyGSM/issues/new', icon: <BugReportIcon />},
    { text: 'Settings', open: '', icon: <SettingsIcon />},
];
const bottomItems: MenuListItem[] = [
    { text: 'View Source Code', open: 'https://github.com/M4STERAC/EasyGSM', icon: <CodeIcon />},
    { text: 'Contribute Code', open: '', icon: <GitHubIcon />},
    { text: 'Contact', open: '', icon: <MailIcon />},
    { text: 'Donate', open: '', icon: <AttachMoneyIcon />}
];




const Menu = () => {
    const [state, setState] = useContext(StoreContext);
    const theme = useTheme();
    
    
    const handleMenuItemClick = (item: MenuListItem) => {
        if (typeof item.open === 'string') window.open(item.open, '_blank');
        setState((prevState: any) => ({ ...prevState, menuOpen: false }));
    };


    return (
        <Drawer anchor="left" open={state.menuOpen} onClose={() => setState((prevState: any) => ({ ...prevState, menuOpen: false }))} sx={{
            width: '15em',
            height: '100%',
        }}>
            <Box sx={{ marginTop: '40px', height: '100%', width: '100%', backgroundColor: theme.palette.background.default }} role="presentation">
                {topItems.map((item, index) => (
                    <MenuItem key={index} item={item} onClick={() => handleMenuItemClick(item)}/>
                ))}

                <Divider />

                {bottomItems.map((item, index) => (
                    <MenuItem key={index} item={item} onClick={() => handleMenuItemClick(item)} />
                ))}
            </Box>
        </Drawer>
    );
};

export default Menu;