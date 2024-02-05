import React from "react";
import "../css/ServerInfoItem.css";

const ServerInfoItem = ({ selectedServer }) => {
  console.log("loaded ServerInfoItem.js");
  console.log(selectedServer);
  return (
    <div>
      <li>
        <p>{selectedServer.game} - {selectedServer.name}</p>
      </li>
      <li>
        <p>Uptime: {selectedServer.uptime}</p>
      </li>
      <li>
        <a href="#">Edit Ban List</a>
      </li>
      <li>
        <a href="#">Edit Configuration</a>
      </li>
    </div>
  );
};

export default ServerInfoItem;
