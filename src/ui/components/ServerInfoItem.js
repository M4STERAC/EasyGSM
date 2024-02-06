import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../Store";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import { executeBatchScript } from "../utils/executeScripts";
import "../css/ServerInfoItem.css";

const ServerInfoItem = ({ selectedServer }) => {
  const [state, setState] = useContext(StoreContext);
  const [buttonState, setButtonState] = useState(selectedServer.status);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  useEffect(() => {
    setButtonState(selectedServer.status);
  }, [selectedServer.status]);

  const handleButtonClick = () => {
    setTimeout(() => setButtonDisabled(false), 3000);
    executeBatchScript('../../data/CrashManager.bat');
    if (buttonState === "Down") {
      setButtonState("Running");
      setState((prevState) => {
        const serverIndex = prevState.serverList.findIndex(
          (server) => server.id === selectedServer.id
        );
        const newServerList = [...prevState.serverList];
        newServerList[serverIndex] = {
          ...newServerList[serverIndex],
          status: "Running",
        };
        return { ...prevState, serverList: newServerList };
      });
    } else {
      setButtonState("Down");
      setState((prevState) => {
        const serverIndex = prevState.serverList.findIndex(
          (server) => server.id === selectedServer.id
        );
        const newServerList = [...prevState.serverList];
        newServerList[serverIndex] = {
          ...newServerList[serverIndex],
          status: "Down",
        };
        return { ...prevState, serverList: newServerList };
      });
    }
  };

  return (
    <div>
      <li>
        <p>
          {selectedServer.game} - {selectedServer.name}
        </p>
      </li>
      <li>
        <p>Uptime: {selectedServer.uptime}</p>
      </li>
      <li>
        <p>Ports: {selectedServer.ports}</p>
      </li>
      <li>
        <p>Save Directory: {selectedServer.savedirectory}</p>
      </li>
      <li>
        <p>Executable Directory: {selectedServer.executable}</p>
      </li>
      <li>
        <Link to={"/update-server"}>Edit</Link>
      </li>
      <div className="button-container">
        <CSSTransition
          in={buttonState === "Down"}
          timeout={300}
          classNames="start-button"
          unmountOnExit
        >
          <button
            className="start-button"
            onClick={() => handleButtonClick()}
            disabled={isButtonDisabled}
          >
            Start
          </button>
        </CSSTransition>
        <CSSTransition
          in={buttonState !== "Down"}
          timeout={300}
          classNames="stop-button"
          unmountOnExit
        >
          <button
            className="stop-button"
            onClick={() => handleButtonClick()}
            disabled={isButtonDisabled}
          >
            Stop
          </button>
        </CSSTransition>
      </div>
    </div>
  );
};

export default ServerInfoItem;
