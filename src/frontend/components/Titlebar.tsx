import React, { useState, useContext } from 'react';
import "../css/Titlebar.css";
import { StoreContext } from "../Store";


//MUI Items
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';


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
                <Tooltip title='Menu' enterDelay={2000} arrow>
                    <Box onClick={handleMenu} className="box">
                        <MenuIcon />
                    </Box>
                </Tooltip>
            </div>
            <div className="title">EasyGSM</div>
            <div className='titlebar-frame-interaction'>
                <Tooltip title='Minimize' enterDelay={2000} arrow>
                    <Box onClick={handleMinimize} className="box">
                        <MinimizeIcon />
                    </Box>
                </Tooltip>
                <Tooltip title='Maximize' enterDelay={2000} arrow>
                    <Box onClick={handleMaximize} className="box">
                        {isMaximized ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </Box>
                </Tooltip>  
                <Tooltip title='Close' enterDelay={2000} arrow>
                    <Box onClick={handleClose} className="box" id="close">
                        <CloseIcon />
                    </Box>
                </Tooltip>
            </div>
        </div>
    );
};

export default Titlebar;