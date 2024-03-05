import React, { useContext } from "react";
import { StoreContext } from "../Store";
import WelcomePage from "../components/WelcomePage";
import Card from '@mui/material/Card';
import ServerListItem from "../components/ServerListItem";
import ServerInfoItem from "../components/ServerInfoItem";
import UpdateDatabase from "../components/UpdateDatabase";
// import "../css/MainPage.css";

//MUI Items
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';


//Root page of the app. Loads server list and server info components
const MainPage = () => {
  const [state, setState] = useContext(StoreContext);
  const theme = useTheme();
  const ServerCardStyles = { backgroundColor: theme.palette.background.default, color: theme.palette.common.white, overflowY: 'auto', height: '25em', width: '25em', padding: '1em'};
  const HardwareResourceCardStyles = { backgroundColor: theme.palette.background.default, color: theme.palette.common.white, height: '20em', width: '64em', padding: '1em 1em 3em', margin: '4em'};


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
          <Button onClick={() => handleAddServerClick({ isUpdate: false })}>Add Server</Button>
        </Card>
  
        <Card sx={{...ServerCardStyles, overflowY: 'hidden', marginLeft: '5em'}}>
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
        </Card>
      </div>
    </div>
  );
};

export default MainPage;