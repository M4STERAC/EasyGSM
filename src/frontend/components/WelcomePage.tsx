import React, { useContext, useEffect } from 'react';
import { StoreContext } from "../Store";
import ConfirmationDialog from './ConfirmationDialog';
import '../css/ButtonStyles.css';
import "../css/Forms.css";

const WelcomePage = () => {
    const [state, setState] = useContext(StoreContext);
    

    const handleAccept = () => {
        window.electron.invoke("save-data", { storageName: "firstLaunchStatus", data: false });
        window.electron.dlDependencies();
        setState((prevState: any) => ({ ...prevState, firstLaunchStatus: false }));
    };


    const handleDecline = () => {
        window.electron.close();
    };


    return (
        <ConfirmationDialog title="Welcome!" width="md" buttons={[{ text: 'Accept', func: handleAccept }, { text: 'Close Application', func: handleDecline }]}>
            <p>EasyGSM is a tool used to make downloading, commissioning, managing, and decommissioning easy and automated.</p> 
            <p>This application will download and install the following required dependencies: </p>
            <ul>
                <li>SteamCMD</li>
            </ul>
            <br />
        </ConfirmationDialog>
    );
};

export default WelcomePage;