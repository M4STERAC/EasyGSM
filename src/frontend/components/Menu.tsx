import React, { useState, useContext } from 'react';
import { StoreContext } from "../Store";


//Custom
import MenuItem from './MenuItem';
import { MenuListItem } from "../utils/types";
import "../css/Menu.css";


//MUI Items
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';


//MUI Icons
import MailIcon from '@mui/icons-material/Mail';
import BugReportIcon from '@mui/icons-material/BugReport';
import PolicyIcon from '@mui/icons-material/Policy';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';


const topItems: MenuListItem[] = [
    { text: 'Report Issue', link: 'https://github.com/M4STERAC/EasyGSM/issues/new', icon: <BugReportIcon />},
    { text: 'Contact', link: '', icon: <MailIcon />},
    { text: 'License', link: '', icon: <PolicyIcon />},
];
const bottomItems: MenuListItem[] = [
    { text: 'View Source Code', link: 'https://github.com/M4STERAC/EasyGSM', icon: <CodeIcon />},
    { text: 'Contribute', link: '', icon: <GitHubIcon />},
    { text: 'Donate', link: '', icon: <AttachMoneyIcon />}
];


const Menu = () => {
    const [state, setState] = useContext(StoreContext);
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <Box sx={{ width: 250 }} role="presentation">
            <Drawer open={open} onClose={toggleDrawer(false)}>
            {topItems.map((item, index) => (
                <MenuItem key={index} item={item} />
            ))}

            <Divider />

            {bottomItems.map((item, index) => (
                <MenuItem key={index} item={item} />
            ))}
            </Drawer>
        </Box>
    );
};

export default Menu;