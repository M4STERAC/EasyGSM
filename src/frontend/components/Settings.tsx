import React, { useState, useContext } from 'react';
import { StoreContext } from "../Store";
import { useTheme } from '@mui/material/styles';


const Settings = () => {
    const [state, setState] = useContext(StoreContext);
    const theme = useTheme();


    return (
        <div>
            <p>Settings Component</p>
        </div>
    );
};


export default Settings;