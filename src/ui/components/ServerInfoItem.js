import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../Store";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import "../css/ServerInfoItem.css";

const ServerInfoItem = ({ selectedServer }) => {
  const [state, setState] = useContext(StoreContext);
  const [buttonState, setButtonState] = useState("Down");
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const executeServer = (channel, scriptPath) => {
    window.electron
      .invoke(channel, scriptPath)
      .then((output) => console.log(output))
      .catch((error) => console.error(error));
  };

  const handleStartButtonClick = () => {
    setTimeout(() => setButtonDisabled(false), 3000);
    executeServer("start-server", selectedServer);
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
    executeServer("stop-server", selectedServer);
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
      <p>
        {selectedServer.game} - {selectedServer.name}
      </p>
      <p>Uptime: {selectedServer.uptime}</p>
      <label>Ports Required</label>
      <ul>
        <li>TCP Ports: {selectedServer.ports.tcpinbound}</li>
        <li>TCP Ports: {selectedServer.ports.tcpoutbound}</li>
        <li>UPD Ports: {selectedServer.ports.udpinbound}</li>
        <li>UDP Ports: {selectedServer.ports.udpoutbound}</li>
      </ul>
      <Link className="edit" to={"/update-server"}>
        Edit
      </Link>
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
