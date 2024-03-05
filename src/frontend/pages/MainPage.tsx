import React, { useContext, useState } from "react";
import { StoreContext } from "../Store";
import WelcomePage from "../components/WelcomePage";
import Card from '@mui/material/Card';
import ServerListItem from "../components/ServerListItem";
import ServerInfoItem from "../components/ServerInfoItem";
import UpdateDatabase from "../components/UpdateDatabase";
import SnackbarMessage from "../components/SnackbarMessage";

//MUI Items
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';


//Root page of the app. Loads server list and server info components
const MainPage = () => {
  const [state, setState] = useContext(StoreContext);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const theme = useTheme();
  const ServerCardStyles = { backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, overflowY: 'auto', height: '25em', width: '25em', padding: '1em'};
  const HardwareResourceCardStyles = { backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, height: '20em', width: '64em', padding: '1em 1em 3em', margin: '4em'};


  //Updates selectedServer when a server is clicked
  const handleServerClick = (server: Server) => {
    setState((prevState: any) => ({ ...prevState, selectedServer: server }));
  };


  const handleSnackbarClose = (__: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
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
          setSnackbar({ open: true, message: `${state.selectedServer.game} - ${state.selectedServer.name} Started` })
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
        setSnackbar({ open: true, message: `${state.selectedServer.game} - ${state.selectedServer.name} Stopped` })
        return { ...prevState, serverList: newServerList, selectedServer: { ...prevState.selectedServer, status: "Down" }};
      });
    }).catch((error: any) => console.error(error));
  };

  const handleAddServerClick = ({ isUpdate }: any) => {
    setState((prevState: any) => ({ ...prevState, addServerDialogOpen: true, isUpdate: isUpdate }));
  };


  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {state.firstLaunch ? <WelcomePage /> : null}
      {state.addServerDialogOpen ? <UpdateDatabase isUpdate={state.isUpdate} /> : null}
  
      <Card sx={HardwareResourceCardStyles}>
        <h2 className='card-title'>Resource Levels</h2>
      </Card>
  
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Card sx={{...ServerCardStyles, marginRight: '5em'}}>
          <h2 className='card-title'>Server List</h2>
          {state.serverList && state.serverList.map((server: Server, index: number) => (
            <ServerListItem onClick={() => handleServerClick(server)} key={index} server={server}/>
          ))}
          <Tooltip title='Add a server configuration' enterDelay={4000} arrow><Button onClick={() => handleAddServerClick({ isUpdate: false })}>Add Server</Button></Tooltip>
        </Card>
  
        <Card sx={{...ServerCardStyles, overflowY: 'hidden', marginLeft: '5em'}}>
          <h2 className='card-title'>Server Info</h2>
          {state.selectedServer ? (
          <ServerInfoItem selectedServer={state.selectedServer} />) : (<p>Select a server</p>)}
          {state.selectedServer ? (
            state.selectedServer.status === "Down" ? (
              <div>
                <Tooltip title='Starts this server' enterDelay={4000} arrow><Button onClick={handleStartButtonClick}>Start</Button></Tooltip>
                <Tooltip title="Edit this server's configuration" enterDelay={4000} arrow><Button onClick={() => handleAddServerClick({ isUpdate: true })}>Edit</Button></Tooltip>
              </div>
            ) : <Tooltip title="Stops this server" enterDelay={4000} arrow><Button onClick={handleStopButtonClick}>Stop</Button></Tooltip>
          ) : (null)}
        </Card>
      </div>
      {state.serverList.length > 1 ? <SnackbarMessage message={snackbar.message} open={snackbar.open} handleClose={handleSnackbarClose} /> : null}
    </div>
  );
};

export default MainPage;