import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../Store";
import Card from "../components/Card";
import Footer from "../components/Footer";
import ServerListItem from "../components/ServerListItem";
import ServerInfoItem from "../components/ServerInfoItem";
import logo from "../images/EasyGSMLogo.png";
import "../css/General.css";
import "../css/MainPage.css";

console.debug("loaded MainPage.js");
const MainPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useContext(StoreContext);
  console.log(state);

  const handleServerClick = (server) => {
    setState((prevState) => ({
      ...prevState,
      selectedServer: server,
    }));
  };

  useEffect(() => {
    fetch("http://localhost:3001/Server")
      .then((response) => response.json())
      .then((data) => setState((prevState) => ({ ...prevState, serverList: data })))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="general-style">
      <div className="content">
        <Card>
          <h2 className="card-title">SERVER LIST</h2>
          <ul className="clickable-list">
            {state.serverList &&
              state.serverList.map((server, index) => (
                <ServerListItem
                  onClick={() => handleServerClick(server)}
                  key={index}
                  server={server}
                  selectedServer={state.selectedServer}
                />
              ))}
          </ul>
          <button
            className="add-server"
            onClick={() => navigate("/add-server")}
          >
            +
          </button>
        </Card>
        <Card>
          <h2 className="card-title">SERVER INFO</h2>
          <ul className="clickable-list">
            {state.selectedServer ? (
              <ServerInfoItem selectedServer={state.selectedServer} />
            ) : (
              <li>Select a server</li>
            )}
          </ul>
        </Card>
      </div>
      <Footer>
        <div>
          <div className="footer-logo">
            <img src={logo} alt="EasyGSM Logo" />
          </div>
          <div className="footer-text">
            EasyGSM is an open source software. Please credit
            https://github.com/M4STERAC/EasyGSM as the first author of the
            program in all areas where credit is due.
          </div>
        </div>
      </Footer>
    </div>
  );
};

export default MainPage;
