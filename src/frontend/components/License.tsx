import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from './ConfirmationDialog';
import { useTheme } from '@mui/material/styles';

const License = () => {
    const [licenseText, setLicenseText] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const fetchLicenseText = async () => {
            try {
                const response = await fetch('../../../license.md');
                const text = await response.text();
                setLicenseText(text);
            } catch (error) {
                console.error('Error fetching license text:', error);
            }
        };

        fetchLicenseText();
    }, []);

    return (
        <ConfirmationDialog title='License Agreement' buttons={[{ text: 'Accept' }]}>
            <p>{licenseText ?? navigate('*')}</p>
        </ConfirmationDialog>
    );
};

export default License;