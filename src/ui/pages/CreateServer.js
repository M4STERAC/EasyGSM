import React, { useState, useContext, useEffect } from "react";
import { createUTCDate, generateId } from "../utils/generalFunctions";
import { StoreContext } from "../Store";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import {
  validateIpAddress,
  validatePort,
  checkDuplicateIds,
  validateFilePath
} from "../utils/dataValidation";
import "../css/CreateServer.css";

const CreateServer = () => {
  const navigate = useNavigate();
  const [state, setState] = useContext(StoreContext);
  const [id, setId] = useState(generateId(10));
  const [game, setGame] = useState("");
  const [name, setName] = useState("");
  const [executable, setExecutable] = useState("");
  const [saveDirectory, setSaveDirectory] = useState("");
  const [banlist, setBanlist] = useState("");
  const [ports, setPorts] = useState({
    tcpinbound: "",
    tcpoutbound: "",
    udpinbound: "",
    udpoutbound: "",
  });
  const [errors, setErrors] = useState({banlistError: '', portError: '', pathError: '', requiredFieldsError: ''});
  const [backupTime, setBackupTime] = useState("06:00");

  useEffect(() => {
    if (errors) console.error(errors);
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let postFail = false;
    console.log(`Creating ID: ${id}`);

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

    const portsArray = Object.values(ports);
    for (let portList of portsArray) {
      const portSplit = portList.split(",");
      for (let port of portSplit) {
        port = port.replaceAll(/[^\d]/gm, "").trim();
        if (port === "") continue;
        if (!validatePort(port)) {
          setErrors((prevState) => ({...prevState, portError: "Invalid Port: " + port}));
          postFail = true;
          break;
        } else {
          console.log("Port: " + port + " is valid");
          setErrors((prevState) => ({...prevState, portError: ''}));
        }
      }
    }

    while (true) {
      if (checkDuplicateIds(state.serverList, id)) {
        const newId = generateId(10);
        if (id === newId) continue;
        setId(newId);
      }
      break;
    }

    if (!validateFilePath(executable)) {
      setErrors((prevState) => ({...prevState, pathError: "Invalid Path to Game Executable. Ensure the path is correct and it only contains alphanumeric characters, dashes, and/or underscores."}));
      postFail = true;
    }
    if (!validateFilePath(saveDirectory)) {
      setErrors((prevState) => ({...prevState, pathError: "Invalid Save Directory. Ensure the path is correct and it only contains alphanumeric characters, dashes, and/or underscores."}));
      postFail = true;
    }

    if (game === "" || name === "" || executable === "" || saveDirectory === "") {
      setErrors((prevState) => ({...prevState, requiredFieldsError: "Game, Name, Executable, and Save Directory are required fields."}));
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
        .then(() => console.log("Database: ", state.serverList))
        .then(() => navigate("/"))
        .catch((error) => console.error(error));
    }
  };

  return (
    <Card>
      <h2 className="card-title">Create Server</h2>
      <form onSubmit={handleSubmit} className="server-form">
        <label>Game:</label>
        <input
          type="text"
          value={game}
          onChange={(e) => setGame(e.target.value)}
          placeholder="Elden Ring"
        />
        <br />
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Elden Ring Server 1"
        />
        <br />
        <label>Path to Game Executable:</label>
        <input
          type="text"
          onChange={(e) => {
            setExecutable(e.target.value);
          }}
          placeholder="C:\Program Files (x86)\Steam\steamapps\common\EldenRing\EldenRing.exe"
        />
        <br />
        <label>Save Directory:</label>
        <input
          type="text"
          onChange={(e) => {
            setSaveDirectory(e.target.value);
          }}
          placeholder="C:\Users\mrman\AppData\Roaming\EldenRing\76561198108742533"
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
          placeholder="255.255.255.255, 255.255.255.254"
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
                placeholder="8221, 27115"
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
                placeholder="8221, 27115"
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
                placeholder="8221, 27115"
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
                placeholder="8221, 27115"
              />
            </li>
          </ul>
        </div>
        {errors.banlistError ? <p className="error">{errors.banlistError}</p> : null}
        {errors.portError ? <p className="error">{errors.portError}</p> : null}
        {errors.pathError ? <p className="error">{errors.pathError}</p> : null}
        {errors.requiredFieldsError ? <p className="error">{errors.requiredFieldsError}</p> : null}
        <div className="button-container">
          <button type="submit" className="submit-button">
            Create
          </button>
          <button className="cancel-button" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
};

export default CreateServer;
