import React, { useState, useContext } from "react";
import { StoreContext } from "../Store";
import "../css/ServerInfoItem.css";
import "../css/Links.css";

//When a server is selected from ServerListItem component, this component will display the properties of that selected server
const ServerInfoItem = ({ selectedServer }: { selectedServer: Server }) => {

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
    </div>
  );
};

export default ServerInfoItem;
