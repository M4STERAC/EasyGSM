import React, { useState, useContext, useEffect } from "react";
import { createUTCDate } from "../utils/generalFunctions";
import { StoreContext } from "../Store";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { validateIpAddress } from "../utils/dataValidation";
import "../css/CreateServer.css";

const CreateServer = () => {
  const navigate = useNavigate();
  const [state, setState] = useContext(StoreContext);
  const [game, setGame] = useState("");
  const [name, setName] = useState("");
  const [executable, setExecutable] = useState("");
  const [saveDirectory, setSaveDirectory] = useState("");
  const [banlist, setBanlist] = useState("");
  const [banlistError, setBanlistError] = useState("");
  const [ports, setPorts] = useState({ tcpinbound: "", tcpoutbound: "", udpinbound: "", udpoutbound: "" });

  useEffect(() => { 
    console.error(banlistError);
  }, [banlistError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let postFail = false;


    const ips = banlist.split(",");
    for (let ip of ips) {
      ip = ip.replaceAll(/[^\d\.]/gm, "").trim();
      if (!validateIpAddress(ip)) {
        setBanlistError("Invalid IP address: " + ip);
        postFail = true;
        break;
      }
      else console.log("IP Address: " + ip + " is valid");
    }

    if (!postFail) {
      window.electron
        .invoke('save-data', {
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
          lastupdate: await createUTCDate()
        })
        .then((data) => setState((prevState) => ({ ...prevState, serverList: data })))
        .then(() => console.log('Database: ', state.serverList))
        .then(() => navigate("/"))
        .catch((error) => console.error(error));
    } else console.log(banlistError);
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
        <label>Banlist:</label>
        {banlistError ? <p className="error">{banlistError}</p> : null}
        <input
          type="text"
          value={banlist}
          onChange={(e) => setBanlist(e.target.value)}
          placeholder="255.255.255.255, 255.255.255.254"
        />
        <br />
        <label>TCP Inbound Ports Required:</label>
        <input
          type="text"
          value={ports.tcpinbound}
          onChange={(e) => setPorts({...ports, tcpinbound: e.target.value})}
          placeholder="8221, 27115"
        />
        <label>TCP Outbound Ports Required:</label>
        <input
          type="text"
          value={ports.tcpoutbound}
          onChange={(e) => setPorts({...ports, tcpoutbound: e.target.value})}
          placeholder="8221, 27115"
        />
        <label>UDP Inbound Ports Required:</label>
        <input
          type="text"
          value={ports.udpinbound}
          onChange={(e) => setPorts({...ports, udpinbound: e.target.value})}
          placeholder="8221, 27115"
        />
        <label>UDP Outbound Ports Required:</label>
        <input
          type="text"
          value={ports.udpoutbound}
          onChange={(e) => setPorts({...ports, udpoutbound: e.target.value})}
          placeholder="8221, 27115"
        />
        <br />
        {banlistError ? (
          <p className="error">
            Failed to create server. Please validate input data.
          </p>
        ) : null}
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
