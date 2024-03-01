import React, { useState, useContext } from 'react';
import "../css/Titlebar.css";
import { StoreContext } from "../Store";


import Box from '@mui/material/Box';


//MUI Icons
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import MenuIcon from '@mui/icons-material/Menu';


const Titlebar = () => {
    const [state, setState] = useContext(StoreContext);
    const [isMaximized, setIsMaximized] = useState(false);

    const handleMaximize = () => {
        window.electron.maximize();
        setIsMaximized(!isMaximized);
    };

    const handleMinimize = () => window.electron.minimize();

    const handleClose = () => window.electron.close();

    const handleMenu = () => {
        setState((prevState: any) => ({ ...prevState, menuOpen: !prevState.menuOpen }));
    };

    return (
        <div className="titlebar">
            <div className="menu">
                <Box onClick={handleMenu} className="box">
                    <MenuIcon />
                </Box>
            </div>
            <div className="title">EasyGSM</div>
            <div className='titlebar-frame-interaction'>
                <Box onClick={handleMinimize} className="box">
                    <MinimizeIcon />
                </Box>
                <Box onClick={handleMaximize} className="box">
                    {isMaximized ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </Box>
                <Box onClick={handleClose} className="box" id="close">
                    <CloseIcon />
                </Box>
            </div>
        </div>
    );
};

export default Titlebar;