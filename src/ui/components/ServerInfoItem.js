import React from "react";
import { Link } from "react-router-dom";
import "../css/ServerInfoItem.css";

const ServerInfoItem = ({ selectedServer }) => {
  return (
    <div>
      <li>
        <p>
          {selectedServer.game} - {selectedServer.name}
        </p>
      </li>
      <li>
        <p>Uptime: {selectedServer.uptime}</p>
      </li>
      <li>
        <Link to={{ pathname: "/update-server", state: { yourState: selectedServer }}}>
          Edit Configuration
        </Link>
      </li>
    </div>
  );
};

export default ServerInfoItem;
