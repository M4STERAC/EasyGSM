import React, { useState, useContext, useEffect } from "react";
import { createUTCDate } from "../utils/generalFunctions";
import { validateIpAddress, validatePort, validateFilePath } from "../utils/dataValidation";
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
  const [ports, setPorts] = useState(state.selectedServer.ports);
  const [backupTime, setBackupTime] = useState("06:00");
  const [errors, setErrors] = useState({errors: '', portError: '', pathError: '', requiredFieldsError: ''});

  console.log("loaded updateserver");
  console.log(id);
  console.log(state.selectedServer);

  useEffect(() => {
    if (errors) console.error(errors);
    if (errors) console.error(errors);
  }, [errors, errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let postFail = false;

    const ips = banlist.split(",");
    for (let ip of ips) {
      ip = ip.replaceAll(/[^\d\.]/gm, "").trim();
      if (ip === "") {
        setErrors((prevState) => ({...prevState, banlistError: ''}));
        continue;
      }
      if (!validateIpAddress(ip)) {
        setErrors((prevState) => ({...prevState, banlistError: "Invalid IP address: " + ip}));
        postFail = true;
        break;
      } else {
        console.log("IP Address: " + ip + " is valid");
        setErrors((prevState) => ({...prevState, banlistError: ''}));
      }
    }

    if (
      ports.tcpinbound === "" &&
      ports.tcpoutbound === "" &&
      ports.udpinbound === "" &&
      ports.udpoutbound === ""
    ) {
      postFail = false;
      setErrors((prevState) => ({ ...prevState, portError: "" }));
    } else {
      const portsArray = Object.values(ports);
      for (let portList of portsArray) {
        const portSplit = portList.split(",");
        for (let port of portSplit) {
          port = port.replaceAll(/[^\d]/gm, "").trim();
          if (port === "") continue;
          if (!validatePort(port)) {
            setErrors((prevState) => ({
              ...prevState,
              portError: "Invalid Port: " + port,
            }));
            postFail = true;
            break;
          } else {
            console.log("Port: " + port + " is valid");
            setErrors((prevState) => ({ ...prevState, portError: "" }));
            postFail = false;
          }
        }
      }
    }

    if (!validateFilePath(executable)) {
      setErrors((prevState) => ({...prevState, pathError: "Invalid Path to Game Executable. Ensure the path is correct and it only contains alphanumeric characters, dashes, and/or underscores."}));
      postFail = true;
    }
    if (!validateFilePath(saveDirectory)) {
      setErrors((prevState) => ({...prevState, pathError: "Invalid Save Directory. Ensure the path is correct and it only contains alphanumeric characters, dashes, and/or underscores."}));
      postFail = true;
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
          backuptime: backupTime,
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
            <label>Backup Time:</label>
            <input
              type="time"
              value={backupTime}
              onChange={(e) => setBackupTime(e.target.value)}
              placeholder="06:00"
            />
            <br />
            <label>Banlist:</label>
            <input
              type="text"
              value={banlist}
              onChange={(e) => setBanlist(e.target.value)}
              placeholder={banlist}
            />
            <br />
            <div>
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
            {errors.requiredFieldsError ? <p className="error">{errors.requiredFieldsError}</p> : null}
            {errors.pathError ? <p className="error">{errors.pathError}</p> : null}
            {errors.banlistError ? <p className="error">{errors.banlistError}</p> : null}
            {errors.portError ? <p className="error">{errors.portError}</p> : null}
            <div className="button-container">
              <button type="submit" className="submit-button">
                Update
              </button>
              <button
                className="cancel-button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
              >
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
