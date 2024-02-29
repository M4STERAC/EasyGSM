import React, { useState, useContext } from 'react';
import { StoreContext } from "../Store";
import { useNavigate } from "react-router-dom";
import { sanitizeFilePath, validateFilePath } from '../utils/dataValidation';
import Card from './Card';
import '../css/ButtonStyles.css';
import "../css/Forms.css";

const WelcomePage = () => {

    const navigate = useNavigate();
    const [state, setState] = useContext(StoreContext);
    const [steamcmdPath, setSteamcmdPath] = useState(state.steamcmdPath ?? "");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("steamcmdPath: ", steamcmdPath);
        window.electron.invoke("save-data", { storageName: "firstLaunchStatus", data: false });
        setState((prevState: any) => ({ ...prevState, firstLaunchStatus: false, steamcmdPath: (steamcmdPath !== "" ? steamcmdPath : state.steamcmdPath)}));
        window.electron.invoke("save-data", { storageName: "steamcmd", data: steamcmdPath !== "" ? steamcmdPath : state.steamcmdPath }).then(() => navigate("/"));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const scrubbedFilePath = sanitizeFilePath(event.target.value);
        const isValidFilePath = validateFilePath(scrubbedFilePath);
        if (isValidFilePath) setSteamcmdPath(scrubbedFilePath);
    }

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
                <input type="text" id="steamcmd" name="steamcmd" placeholder={state.steamcmdPath ?? "path/to/steamcmd.exe"} value={steamcmdPath} onChange={handleInputChange} /> {/* Modify this line */}
                <div className='button-container'>
                    <button className='submit-button' type="submit">Accept</button>
                </div>
            </form>
        </Card>
    );
};

export default WelcomePage;