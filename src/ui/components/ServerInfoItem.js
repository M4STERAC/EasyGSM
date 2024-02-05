import React from "react";

const ServerInfoItem = ({ selectedServer }) => {
  console.log("loaded ServerInfoItem.js");
  console.log(selectedServer);
  return ( 
    <div>
      <li>
        <a href="#">Uptime: {selectedServer.uptime}</a>
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
