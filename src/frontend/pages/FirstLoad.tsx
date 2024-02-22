import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from "../Store";
import { useNavigate } from "react-router-dom";
import Card from '../components/Card';
import '../css/ButtonStyles.css';
import "../css/Forms.css";

const WelcomePage = () => {

    console.log("FirstLoad.tsx");

    const navigate = useNavigate();
    const [state, setState] = useContext(StoreContext);
    const [steamcmdPath, setSteamcmdPath] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setState((prevState: any) => ({ ...prevState, firstLaunchStatus: false, steamcmdPath }));
        window.electron.invoke("save-data", { storageName: "firstLaunchStatus", data: false });
        window.electron.invoke("save-data", { storageName: "steamcmd", data: steamcmdPath }).then(() => navigate("/"));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSteamcmdPath(event.target.value);
    };

    return (
        <Card>
            <h1>Welcome to EasyGSM!</h1>
            <p>EasyGSM is a tool used to make downloading, commissioning, managing, and decommissioning easy and automated.</p> 
            <br />
            <p>We highly recommend installing SteamCMD and putting the path to steamcmd.exe after install in the textbox below</p>
            <p>This allows EasyGSM to automatically install updates to your servers and/or download new servers!</p>
            <br />
            <form onSubmit={handleSubmit} className='form'>
                <label>Path to installed steamcmd.exe</label> <br />
                <input type="text" id="steamcmd" name="steamcmd" placeholder="path/to/steamcmd.exe" value={steamcmdPath} onChange={handleInputChange} /> {/* Modify this line */}
                <div className='button-container'>
                    <button className='submit-button' type="submit">Accept</button>
                </div>
            </form>
        </Card>
    );
};

export default WelcomePage;