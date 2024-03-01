import React, { useContext } from "react";
import { StoreContext } from "../Store";
import WelcomePage from "../components/WelcomePage";
import MainCard from "../components/MainCard";
import ServerListItem from "../components/ServerListItem";
import ServerInfoItem from "../components/ServerInfoItem";
import Button from '@mui/material/Button';

//MUI Items
import { useTheme } from '@mui/material/styles';

import "../css/MainPage.css";
import Grid from "@mui/material/Grid";
import UpdateDatabase from "../components/UpdateDatabase";

//Root page of the app. Loads server list and server info components
const MainPage = () => {
  const [state, setState] = useContext(StoreContext);
  const theme = useTheme();


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

  const handleAddServerClick = ({ isUpdate }: any) => {
    setState((prevState: any) => ({ ...prevState, addServerDialogOpen: true, isUpdate: isUpdate }));
  };

  return (
    <Grid container rowSpacing={6} columnSpacing={4} style={{
      padding: 0,
      marginTop: '2em'
    }}>
      {/* {state.firstLaunch ? <WelcomePage /> : null} */}
      <WelcomePage />
      {state.addServerDialogOpen ? <UpdateDatabase isUpdate={state.isUpdate} /> : null}

      <Grid item xs={12}>
        <MainCard>
          <h2 className='card-title'>Resource Levels</h2>
        </MainCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <MainCard>
          <h2 className='card-title'>Server List</h2>
          {state.serverList && state.serverList.map((server: Server, index: number) => (
            <ServerListItem onClick={() => handleServerClick(server)} key={index} server={server}/>
          ))}
          <Button onClick={() => handleAddServerClick({ isUpdate: false })}>Add Server</Button>
        </MainCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <MainCard>
          <h2 className='card-title'>Server Info</h2>
          {state.selectedServer ? (
          <ServerInfoItem selectedServer={state.selectedServer} />) : (<p>Select a server</p>)}
          {state.selectedServer ? (
            state.selectedServer.status === "Down" ? (
              <div>
                <Button onClick={handleStartButtonClick}>Start</Button>
                <Button onClick={() => handleAddServerClick({ isUpdate: true })}>Edit</Button>
              </div>
            ) : <Button onClick={handleStopButtonClick}>Stop</Button>
          ) : (null)}
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default MainPage;