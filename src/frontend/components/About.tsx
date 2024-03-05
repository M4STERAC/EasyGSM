import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from './ConfirmationDialog';
import { useTheme } from '@mui/material/styles';

const About = () => {
    const navigate = useNavigate();
    const theme = useTheme();


    return (
        <ConfirmationDialog title='About' buttons={[{ text: 'Accept' }]}>
            <p>EasyGSM is an open source software used to make automating commissioning, managing, and decommissioning game servers easy.</p>
        </ConfirmationDialog>
    );
};

export default About;