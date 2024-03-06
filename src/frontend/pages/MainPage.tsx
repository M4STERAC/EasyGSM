import React, { useContext, useState } from "react";
import { StoreContext } from "../Store";
import WelcomePage from "../components/WelcomePage";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import ServerListItem from "../components/ServerListItem";
import ServerInfoItem from "../components/ServerInfoItem";
import UpdateDatabase from "../components/UpdateDatabase";
import SnackbarMessage from "../components/SnackbarMessage";

//MUI Items
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { SxProps, useTheme } from '@mui/material/styles';
import Box from "@mui/material/Box";


//Root page of the app. Loads server list and server info components
const MainPage = () => {
  const [state, setState] = useContext(StoreContext);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const theme = useTheme();
  const DefaultCardStyles: SxProps = { margin: '2em 2em 1em' };
  const DefaultCardHeaderStyles: SxProps = { backgroundColor: theme.palette.primary.main, color: theme.palette.text.secondary, height: '4em', width: '25em', top: '0', paddingLeft: '1em' };
  const DefaultCardContentStyles: SxProps = { backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, height: '23em', width: '25em', paddingLeft: '1em' };



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
    <>
      {state.firstLaunch ? <WelcomePage /> : null}
      {state.addServerDialogOpen ? <UpdateDatabase isUpdate={state.isUpdate} /> : null}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card sx={DefaultCardStyles}>
        <CardHeader title="Resource Levels" sx={{ ...DefaultCardHeaderStyles, width: '64em' }} />
          <CardContent sx={{ ...DefaultCardContentStyles, width: '64em' }}>
            <Box sx={{ border: '1px solid black', height: '100%', width: '25%' }}>
              <h2>CPU</h2>
              <p>Usage: 0%</p>
              <p>Temperature: 0°C</p>
            </Box>
            
            <Box sx={{ border: '1px solid black', height: '100%', width: '25%' }}>
              <h2>Memory</h2>
              <p>Usage: 0%</p>
              <p>Temperature: 0°C</p>
            </Box>

            <Box sx={{ border: '1px solid black', height: '100%', width: '25%' }}>
              <h2>Storage</h2>
              <p>Usage: 0%</p>
              <p>Temperature: 0°C</p>
            </Box>

            <Box sx={{ border: '1px solid black', height: '100%', width: '25%' }}>
              <h2>Internet</h2>
              <p>Usage: 0%</p>
              <p>Temperature: 0°C</p>
            </Box>
          </CardContent>
        </Card>
      </div>
    
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Card sx={DefaultCardStyles}>
        <CardHeader title="Server List" sx={DefaultCardHeaderStyles} />
          <CardContent sx={DefaultCardContentStyles}>
            {state.serverList && state.serverList.map((server: Server, index: number) => (
              <ServerListItem onClick={() => handleServerClick(server)} key={index} server={server}/>
            ))}
            <Tooltip title='Add a server configuration' enterDelay={4000} arrow><Button onClick={() => handleAddServerClick({ isUpdate: false })}>Add Server</Button></Tooltip>
          </CardContent>
        </Card>
    
        <Card sx={DefaultCardStyles}>
        <CardHeader title="Server Info" sx={DefaultCardHeaderStyles} />
          <CardContent sx={DefaultCardContentStyles}>
            {state.selectedServer ? (<ServerInfoItem selectedServer={state.selectedServer} />) : (<p>Select a server</p>)}
            {state && state.selectedServer ? 
              (state.selectedServer.status === 'Down' ? 
                <Tooltip title="Start this server" enterDelay={4000} arrow><Button variant="contained" onClick={handleStartButtonClick}>Start</Button></Tooltip> 
                : <Tooltip title="Stop this server" enterDelay={4000} arrow><Button variant="contained" onClick={handleStopButtonClick}>Stop</Button></Tooltip>)
              : null}
            {state.selectedServer ? <Tooltip title="Edit this server's configuration" enterDelay={4000} arrow><Button variant="outlined" disabled={state.selectedServer.status === 'Down' ? false : true} onClick={() => handleAddServerClick({ isUpdate: true })}>Edit</Button></Tooltip>: null}
          </CardContent>
        </Card>
        
        {state.serverList.length > 1 ? <SnackbarMessage message={snackbar.message} open={snackbar.open} handleClose={handleSnackbarClose} severity='info' /> : null}
      </div>
    </>
  );
};

export default MainPage;