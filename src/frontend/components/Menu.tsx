import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from "../Store";


//Custom
import MenuItem from './MenuItem';
import Settings from './Settings';
import About from './About';
import { MenuListItem } from "../utils/types";


//MUI Items
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';


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


const Menu = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [state, setState] = useContext(StoreContext);
    const [selectedComponent, setSelectedComponent] = useState(null as JSX.Element | null);
    const DefaultMenuIconStyle = { color: theme.palette.text.primary };


    const topItems: MenuListItem[] = [
        { text: 'Home', open: null, icon: <HomeIcon sx={DefaultMenuIconStyle} />},
        { text: 'About', open: <About />, icon: <InfoIcon sx={DefaultMenuIconStyle} />},
        { text: 'License', open: <License />, icon: <PolicyIcon sx={DefaultMenuIconStyle} />},
        { text: 'Report Issue', open: 'https://github.com/M4STERAC/EasyGSM/issues/new', icon: <BugReportIcon sx={DefaultMenuIconStyle} />},
        { text: 'Settings', open: <Settings />, icon: <SettingsIcon sx={DefaultMenuIconStyle} />},
    ];
    const bottomItems: MenuListItem[] = [
        { text: 'View Source Code', open: 'https://github.com/M4STERAC/EasyGSM', icon: <CodeIcon sx={DefaultMenuIconStyle} />},
        { text: 'Contribute Code', open: 'https://github.com/M4STERAC/EasyGSM/wiki/Contribution-Guide', icon: <GitHubIcon sx={DefaultMenuIconStyle} />},
        { text: 'Contact', open: '', icon: <MailIcon sx={DefaultMenuIconStyle} />},
        { text: 'Donate', open: '', icon: <AttachMoneyIcon sx={DefaultMenuIconStyle} />}
    ];


    const handleMenuItemClick = (item: MenuListItem) => {
        if (item.text === 'Home') {
            navigate('/');
            setState((prevState: any) => ({ ...prevState, menuOpen: false }));
            return;
        }
        if (typeof item.open === 'string') window.open(item.open, '_blank');
        else setSelectedComponent(item.open as JSX.Element | null);
        setState((prevState: any) => ({ ...prevState, menuOpen: false }));
    };


    return (
        <>
            <Drawer anchor="left" open={state.menuOpen} onClose={() => setState((prevState: any) => ({ ...prevState, menuOpen: false }))} sx={{
                width: '15em',
                height: '100%',
            }}>
                <Box sx={{ marginTop: '40px', height: '100%', width: '100%', backgroundColor: theme.palette.background.default }} role="presentation">
                    <List>
                        {topItems.map((item, index) => (
                            <MenuItem key={index} item={item} onClick={() => handleMenuItemClick(item)}/>
                        ))}

                        <Divider />

                        {bottomItems.map((item, index) => (
                            <MenuItem key={index} item={item} onClick={() => handleMenuItemClick(item)} />
                        ))}
                    </List>
                </Box>
            </Drawer>
            {selectedComponent}
        </>
    );
};


export default Menu;