import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import Footer from "../components/Footer";
import ServerListItem from "../components/ServerListItem";
import ServerInfoItem from "../components/ServerInfoItem";
import "../css/General.css";
import "../css/MainPage.css";

console.debug("loaded MainPage.js");
const MainPage = () => {
  const [serverList, setServerList] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/Server")
      .then((response) => response.json())
      .then((data) => {
        console.debug(data);
        setServerList(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    console.debug("selectedServer changed");
    console.debug(selectedServer);
  }, [selectedServer]);

  return (
    <div className="general-style">
      <div className="content">
        <Card>
          <h2 className="card-title">SERVER LIST</h2>
          <ul className="clickable-list">
            {serverList.map((server, index) => (
              <ServerListItem onClick={() => {
                console.log('CLICKED')
                setSelectedServer(server);
                console.log(selectedServer);
              }} key={index} server={server} />
            ))}
          </ul>
          <button className="add-server">+</button>
        </Card>
        <Card>
          <h2 className="card-title">SERVER INFO</h2>
          <ul className="clickable-list">
            {selectedServer ? <ServerInfoItem selectedServer={selectedServer} /> : <li>Select a server</li>}
          </ul>
        </Card>
      </div>
      <Footer>
        <div>
          <div className="footer-logo">
            <img src="./images/EasyGSMLogo.png" alt="EasyGSM Logo" />
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
