import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../Store";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import "../css/ServerInfoItem.css";

const ServerInfoItem = ({ selectedServer }) => {
  const runScript = (scriptPath) => {
    window.electron.invoke('execute-script', scriptPath)
        .then(output => console.log(output))
        .catch(error => console.error(error));
};
  const [state, setState] = useContext(StoreContext);
  const [buttonState, setButtonState] = useState(selectedServer.status);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  useEffect(() => {
    setButtonState(selectedServer.status);
  }, [selectedServer.status]);

  const handleStartButtonClick = () => {
    setTimeout(() => setButtonDisabled(false), 3000);
    runScript("../../data/CreateBackupSchedule.bat");
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
  };

  const handleStopButtonClick = () => {
    setTimeout(() => setButtonDisabled(false), 3000);
    executeScript("execute-batch", "../../data/CrashManager.bat");
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
        <Link className="edit" to={"/update-server"}>
          Edit
        </Link>
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
            onClick={() => handleStartButtonClick()}
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
            onClick={() => handleStopButtonClick()}
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
