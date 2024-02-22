import React, { useState, useEffect } from 'react';
import { GetData } from '../utils/types';

const WelcomePage = () => {
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        window.electron.invoke('get-data', { storageName: "firstLaunchStatus", defaultValue: undefined } as GetData).then((status: boolean) => {
            if (status) setAccepted(true);
        }).catch((err: Error) => console.error(err));
    }, []);

    const handleAccept = () => {
        // Perform the necessary actions when the user accepts
        // such as installing SteamCMD
        setAccepted(true);
    };

    return (
        <div>
            <h1>Welcome to EasyGSM!</h1>
            <p>EasyGSM is a tool used to make downloading, commissioning, managing, and decommissioning easy and automated.</p>
            {!accepted && (
                <div>
                    <p>By clicking Accept, you allow this software to install SteamCMD for its purpose in downloading and updating Steam supported servers.</p>
                    <button onClick={handleAccept}>Accept</button>
                </div>
            )}
        </div>
    );
};

export default WelcomePage;