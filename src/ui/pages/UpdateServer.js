import React, { useState, useContext, useEffect } from "react";
import { createUTCDate } from "../utils/generalFunctions";
import { validateIpAddress, validatePort } from "../utils/dataValidation";
import { StoreContext } from "../Store";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import "../css/CreateServer.css";

const UpdateServer = () => {
  const navigate = useNavigate();
  const [state, setState] = useContext(StoreContext);
  const [id] = useState(state.selectedServer.id);
  const [game, setGame] = useState(state.selectedServer.game);
  const [name, setName] = useState(state.selectedServer.name);
  const [executable, setExecutable] = useState(state.selectedServer.executable);
  const [saveDirectory, setSaveDirectory] = useState(
    state.selectedServer.saveDirectory
  );
  const [banlist, setBanlist] = useState(state.selectedServer.banlist);
  const [banlistError, setBanlistError] = useState("");
  const [ports, setPorts] = useState(state.selectedServer.ports);
  const [portsError, setPortsError] = useState("");

  console.log("loaded updateserver");
  console.log(id);
  console.log(state.selectedServer);

  useEffect(() => {
    if (banlistError) console.error(banlistError);
    if (portsError) console.error(portsError);
  }, [banlistError, portsError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let postFail = false;

    const ips = banlist.split(",");
    for (let ip of ips) {
      ip = ip.replaceAll(/[^\d\.]/gm, "").trim();
      if (ip === "") {
        setBanlistError("");
        continue;
      }
      if (!validateIpAddress(ip)) {
        setBanlistError("Invalid IP address: " + ip);
        postFail = true;
        break;
      } else {
        console.log("IP Address: " + ip + " is valid");
        setBanlistError("");
      }
    }

    const portsArray = Object.values(ports);
    for (let portList of portsArray) {
      const portSplit = portList.split(",");
      for (let port of portSplit) {
        port = port.replaceAll(/[^\d]/gm, "").trim();
        if (port === "") continue;
        if (!validatePort(port)) {
          setPortsError("Invalid Port: " + port);
          postFail = true;
          break;
        } else {
          console.log("Port: " + port + " is valid");
          setPortsError("");
        }
      }
    }

    if (!postFail) {
      window.electron
        .invoke("save-data", {
          id,
          game,
          name,
          executable,
          uptime: 0,
          status: "Down",
          saveDirectory,
          banlist,
          players: 0,
          ports,
          lastrestart: await createUTCDate(),
          lastupdate: await createUTCDate(),
        })
        .then((data) =>
          setState((prevState) => ({ ...prevState, serverList: data }))
        )
        .then(() => console.log("Updated Database: ", state.serverList))
        .then(() => navigate("/"))
        .catch((error) => console.error(error));
    }
  };

  const deleteServer = () => {
    console.log(`Deleting server with Id ${state.selectedServer.id}`);
    window.electron
      .invoke("delete-data", { id })
      .then((data) =>
        setState((prevState) => ({ ...prevState, serverList: data }))
      )
      .then(() => console.log("Updated Database: ", state.serverList))
      .then(() => navigate("/"))
      .catch((error) => console.error(error));
  };

  return (
    <Card>
      {!state.selectedServer ? (
        <p className="error">
          Failed to get Server Configuration. Please try again later.
        </p>
      ) : (
        <div>
          <h2 className="card-title">Update Server</h2>
          <form onSubmit={handleSubmit} className="server-form">
            <label>Game:</label>
            <input
              type="text"
              value={game}
              onChange={(e) => setGame(e.target.value)}
              placeholder={game}
            />
            <br />
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={name}
            />
            <br />
            <label>Path to Game Executable:</label>
            <input
              type="text"
              onChange={(e) => {
                setExecutable(e.target.value);
              }}
              placeholder={executable}
            />
            <br />
            <label>Save Directory:</label>
            <input
              type="text"
              onChange={(e) => {
                setSaveDirectory(e.target.value);
              }}
              placeholder={state.selectedServer.saveDirectory}
            />
            <br />
            <label>Banlist:</label>
            {banlistError ? <p className="error">{banlistError}</p> : null}
            <input
              type="text"
              value={banlist}
              onChange={(e) => setBanlist(e.target.value)}
              placeholder={banlist}
            />
            <br />
            <div>
              {portsError ? <p className="error">{portsError}</p> : null}
              <p>Required Ports: </p>
              <ul>
                <li>
                  <label>TCP Inbound:</label>
                  <input
                    type="text"
                    value={ports.tcpinbound}
                    onChange={(e) =>
                      setPorts({ ...ports, tcpinbound: e.target.value })
                    }
                    placeholder={ports.tcpinbound}
                  />
                </li>
                <li>
                  <label>TCP Outbound:</label>
                  <input
                    type="text"
                    value={ports.tcpoutbound}
                    onChange={(e) =>
                      setPorts({ ...ports, tcpoutbound: e.target.value })
                    }
                    placeholder={ports.tcpoutbound}
                  />
                </li>
                <li>
                  <label>UDP Inbound:</label>
                  <input
                    type="text"
                    value={ports.udpinbound}
                    onChange={(e) =>
                      setPorts({ ...ports, udpinbound: e.target.value })
                    }
                    placeholder={ports.udpinbound}
                  />
                </li>
                <li>
                  <label>UDP Outbound:</label>
                  <input
                    type="text"
                    value={ports.udpoutbound}
                    onChange={(e) =>
                      setPorts({ ...ports, udpoutbound: e.target.value })
                    }
                    placeholder={ports.udpoutbound}
                  />
                </li>
              </ul>
            </div>
            {banlistError || portsError ? (
              <p className="error">
                Failed to update/delete server. Please validate input data.
              </p>
            ) : null}
            <div className="button-container">
              <button type="submit" className="submit-button">
                Update
              </button>
              <button className="cancel-button" onClick={(e) => {
                e.preventDefault();
                navigate("/");}}>
                Cancel
              </button>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.preventDefault();
                  deleteServer();
                }}
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
};

export default UpdateServer;
