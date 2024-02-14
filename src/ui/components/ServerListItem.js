import React from "react";
import "../css/ServerListItem.css";

const ServerListItem = ({ server, onClick }) => {
  return (
    <p onClick={onClick}>
      <a href="javascript:void(0)" >
        {server.game} - {server.name}{" "}
        <span
          className={
            server.status === "Running" ? "running" : "down"
          }>
          {server.status}
        </span>
      </a>
    </p>
  );
};

export default ServerListItem;
