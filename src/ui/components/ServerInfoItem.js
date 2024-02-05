import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import "../css/ServerInfoItem.css";

const ServerInfoItem = ({ selectedServer }) => {
  const [buttonState, setButtonState] = useState(selectedServer.status);
  useEffect(() => {
    setButtonState(selectedServer.status);
  }, [selectedServer.status]);

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
        <Link
          to={{
            pathname: "/update-server",
            state: { yourState: selectedServer },
          }}
          j
        >
          Edit Configuration
        </Link>
      </li>
      <div className="button-container">
        <CSSTransition
          in={buttonState === "Down"}
          timeout={300}
          classNames="start-button"
          unmountOnExit
        >
          <button
            className="start-button"
            onClick={() => setButtonState("Running")}
          >
            Start
          </button>
        </CSSTransition>
        <CSSTransition
          in={buttonState !== "Down"}
          timeout={300}
          classNames="stop-button"
          unmountOnExit
        >
          <button
            className="stop-button"
            onClick={() => setButtonState("Down")}
          >
            Stop
          </button>
        </CSSTransition>
      </div>
    </div>
  );
};

export default ServerInfoItem;
