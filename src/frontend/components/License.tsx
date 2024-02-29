import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Card from './Card';
import '../css/Card.css';

const License = () => {
    const [licenseText, setLicenseText] = useState('');
    const navigate = useNavigate();

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
        <Card>
            <p>{licenseText ?? navigate('*')}</p>
        </Card>
    );
};

export default License;