import React, { useState, useContext } from "react";
import { StoreContext } from "../Store";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import "../css/ServerInfoItem.css";

//When a server is selected from ServerListItem component, this component will display the properties of that selected server
const ServerInfoItem = ({ selectedServer }: { selectedServer: Server }) => {
  const [state, setState] = useContext(StoreContext);
  const [buttonState, setButtonState] = useState("Down");
  const [isButtonDisabled, setButtonDisabled] = useState(false);


  //Function to start and stop selected server
  const executeServer = (channel: string, server: Server) => {
    window.electron.invoke(channel, server)
      .then((output: any) => console.log(output))
      .catch((error: any) => console.error(error));
  };


  //Function executed when the START button is clicked
  const handleStartButtonClick = () => {
    setTimeout(() => setButtonDisabled(false), 3000);
    executeServer("start-server", selectedServer);
    setButtonState("Running");
    setState((prevState: any) => {
      const serverIndex = prevState.serverList.findIndex((server: Server) => server.id === selectedServer.id);
      const newServerList = [...prevState.serverList];
      newServerList[serverIndex] = { ...newServerList[serverIndex], status: "Running" };
      return { ...prevState, serverList: newServerList };
    });
  };


  //Function executed when the STOP button is clicked
  const handleStopButtonClick = () => {
    setTimeout(() => setButtonDisabled(false), 3000);
    executeServer("stop-server", selectedServer);
    setButtonState("Down");
    setState((prevState: any) => {
      const serverIndex = prevState.serverList.findIndex((server: Server) => server.id === selectedServer.id);
      const newServerList = [...prevState.serverList];
      newServerList[serverIndex] = { ...newServerList[serverIndex], status: "Down" };
      return { ...prevState, serverList: newServerList };
    });
  };

  return (
    <div>
      
      <p>{selectedServer.game} - {selectedServer.name}</p>
      <p>Uptime: {selectedServer.uptime}</p>
      <p>Backup Scheduled: {selectedServer.backuptime}</p>
      <label>Ports Required</label>
      <ul>
        <li>TCP I Ports: {selectedServer.ports.tcpinbound}</li>
        <li>TCP O Ports: {selectedServer.ports.tcpoutbound}</li>
        <li>UPD I Ports: {selectedServer.ports.udpinbound}</li>
        <li>UDP O Ports: {selectedServer.ports.udpoutbound}</li>
      </ul>

      <Link className="edit" to={"/edit-server"}>Edit</Link>

      <div className="button-container">
        <CSSTransition in={buttonState === "Down"} timeout={300} classNames="start-button" unmountOnExit>
          <button className="start-button" onClick={() => handleStartButtonClick()} disabled={isButtonDisabled}>
            Start
          </button>
        </CSSTransition>

        <CSSTransition in={buttonState !== "Down"} timeout={300} classNames="stop-button" unmountOnExit>
          <button className="stop-button" onClick={() => handleStopButtonClick()} disabled={isButtonDisabled}>
            Stop
          </button>
        </CSSTransition>
      </div>

    </div>
  );
};

export default ServerInfoItem;
