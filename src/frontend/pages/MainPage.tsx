import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../Store";
import Card from "../components/Card";
import ServerListItem from "../components/ServerListItem";
import ServerInfoItem from "../components/ServerInfoItem";
import "../css/General.css";
import "../css/MainPage.css";

//Root page of the app. Loads server list and server info components
const MainPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useContext(StoreContext);

  //Updates selectedServer when a server is clicked
  const handleServerClick = (server: Server) => {
    setState((prevState: any) => ({
      ...prevState,
      selectedServer: server,
    }));
  };

  return (
    <div className="general-style">
      <div className="content">

        {/* Shows list of servers */}
        <Card>
          <h2 className="card-title">SERVER LIST</h2>
          {state.serverList && state.serverList.map((server: Server, index: number) => (
              <ServerListItem
                onClick={() => handleServerClick(server)}
                key={index}
                server={server}
              />
          ))}
          <button className="add-server" onClick={() => navigate("/add-server")}>+</button>
        </Card>

        {/* Shows data for selected server */}
        <Card>
          <h2 className="card-title">SERVER INFO</h2>
            {state.selectedServer ? (<ServerInfoItem selectedServer={state.selectedServer} />) : (<p>Select a server</p>)}
        </Card>
      </div>
    </div>
  );
};

export default MainPage;
