import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../Store";
import FirstLoad from "../components/FirstLoad";
import Card from "../components/Card";
import ServerListItem from "../components/ServerListItem";
import ServerInfoItem from "../components/ServerInfoItem";
import { CSSTransition } from "react-transition-group";

//MUI Items
// import Card from '@mui/material/Card';

import "../css/General.css";
import "../css/MainPage.css";

//Root page of the app. Loads server list and server info components
const MainPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useContext(StoreContext);


  //Updates selectedServer when a server is clicked
  const handleServerClick = (server: Server) => {
    setState((prevState: any) => ({ ...prevState, selectedServer: server }));
  };


  //Function executed when the START button is clicked
  const handleStartButtonClick = () => {
    window.electron.invoke("start-server", state.selectedServer).then(() => {
      setState((prevState: any) => {
        if (prevState.selectedServer) {
          const serverIndex = prevState.serverList.findIndex((server: Server) => {
            return server.id === prevState.selectedServer.id
          });
          const newServerList = [...prevState.serverList];
          newServerList[serverIndex] = { ...newServerList[serverIndex], status: "Running" };
          return { ...prevState, serverList: newServerList, selectedServer: { ...prevState.selectedServer, status: "Running"}};
        } else {
          return prevState;
        }
      });
    }).catch((error: any) => console.error(error));
  };


  //Function executed when the STOP button is clicked
  const handleStopButtonClick = () => {
    window.electron.invoke("stop-server", state.selectedServer).then(() => {
      console.log("Send stop request with server: ", state.selectedServer);
      setState((prevState: any) => {
        const serverIndex = prevState.serverList.findIndex((server: Server) => server.id === state.selectedServer.id);
        const newServerList = [...prevState.serverList];
        newServerList[serverIndex] = { ...newServerList[serverIndex], status: "Down" };
        return { ...prevState, serverList: newServerList, selectedServer: { ...prevState.selectedServer, status: "Down" }};
      });
    }).catch((error: any) => console.error(error));
  };

  return (
    <div className="general-style">
      <div className="content">

        {/* Shows list of servers */}
        <Card>
          <h2 className="card-title">SERVER LIST</h2>
          {state.serverList && state.serverList.map((server: Server, index: number) => (
              <ServerListItem onClick={() => handleServerClick(server)} key={index} server={server}/>
          ))}
          <button className="add-server" onClick={() => navigate("/add-server")}>+</button>
        </Card>

        {/* Shows data for selected server */}
        <Card>
          <h2 className="card-title">SERVER INFO</h2>
            {state.selectedServer ? (<ServerInfoItem selectedServer={state.selectedServer} />) : (<p>Select a server</p>)}
          {state.selectedServer ? (
            <div className="button-container">
              <CSSTransition in={state.selectedServer.status === "Down"} timeout={300} classNames="start-button" unmountOnExit>
                <button className="start-button" onClick={() => handleStartButtonClick()}>
                  Start
                </button>
              </CSSTransition>

              <CSSTransition in={state.selectedServer.status !== "Down"} timeout={300} classNames="stop-button" unmountOnExit>
                <button className="stop-button" onClick={() => handleStopButtonClick()}>
                  Stop
                </button>
              </CSSTransition>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
};

export default MainPage;