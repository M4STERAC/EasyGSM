import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from './ConfirmationDialog';
import { useTheme } from '@mui/material/styles';

const Settings = () => {
    const navigate = useNavigate();
    const theme = useTheme();


    return (
        <ConfirmationDialog title='Settings' buttons={[{ text: 'Accept' }]}>
            <p>Settings Component</p>
        </ConfirmationDialog>
    );
};

export default Settings;