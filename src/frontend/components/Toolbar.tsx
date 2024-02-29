import React, { useState } from 'react';
import { StoreContext } from "../Store";
import "../css/Toolbar.css";


import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';


//MUI Icons
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import MenuIcon from '@mui/icons-material/Menu';
// import { WidthFull } from '@mui/icons-material';


const Menu = () => {
    const [isMaximized, setIsMaximized] = useState(false);

    const handleMaximize = () => {
        window.electron.maximize();
        setIsMaximized(!isMaximized);
    };

    const handleMinimize = () => window.electron.minimize();

    const handleClose = () => window.electron.close();

    const handleMenu = () => {};

    return (
        <Toolbar className="toolbar">
            <div className="menu">
                <Box onClick={handleMenu}>
                    <MenuIcon />
                </Box>
            </div>
            <div className='toolbar-frame-interaction'>
                <Box onClick={handleMinimize}>
                    <MinimizeIcon />
                </Box>
                <Box onClick={handleMaximize}>
                    {isMaximized ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </Box>
                <Box onClick={handleClose}>
                    <CloseIcon />
                </Box>
            </div>
        </Toolbar>
    );
};

export default Menu;