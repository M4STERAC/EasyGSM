import React from "react";
import "../css/ServerListItem.css";

const ServerListItem = ({ server }) => {
  return (
    <li>
      <a href="javascript:void(0)">
        {server.game} - {server.name}{" "}
        <span
          className={
            server.status === "Running" ? "running" : server.status === "Ready" ? "ready" : "down"
          }>
          {server.status}
        </span>
      </a>
    </li>
  );
};

export default ServerListItem;
