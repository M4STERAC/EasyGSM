import React, { useState } from "react";
import { createUTCDate } from "../utils/generalFunctions";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import "../css/CreateServer.css";

const CreateServer = () => {
  const navigate = useNavigate();
  const [game, setGame] = useState("");
  const [name, setName] = useState("");
  const [executable, setExecutable] = useState("");
  const [saveDirectory, setSaveDirectory] = useState("");
  const [banlist, setBanlist] = useState("");
  const [postFail, setPostFail] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/Server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        game,
        name,
        executable,
        uptime: 0,
        status: "Down",
        saveDirectory,
        banlist,
        players: 0,
        lastrestart: await createUTCDate(),
        lastupdate: await createUTCDate(),
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .then(() => navigate("/"))
      .catch((error) => {
        console.error("Error:", error);
        setPostFail(true);
      });
  };

  return (
    <Card>
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
          type="file"
          webkitdirectory=""
          directory=""
          multiple
          onChange={(e) => {
            if (e.target.files.length > 0) {
              const path = e.target.files[0].webkitRelativePath
                .split("/")
                .slice(0, -1)
                .join("/");
              setExecutable(path);
            }
          }}
          placeholder="C:\Program Files (x86)\Steam\steamapps\common\EldenRing\EldenRing.exe"
        />
        <br />
        <label>Save Directory:</label>
        <input
          type="file"
          webkitdirectory=""
          directory=""
          multiple
          onChange={(e) => {
            if (e.target.files.length > 0) {
              const path = e.target.files[0].webkitRelativePath
                .split("/")
                .slice(0, -1)
                .join("/");
              setSaveDirectory(path);
            }
          }}
          placeholder="C:\Users\mrman\AppData\Roaming\EldenRing\76561198108742533"
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
        {postFail ? (
          <p className="error">
            Failed to create server. Please validate input data.
          </p>
        ) : null}
        <button type="submit" className="submit-button">
          Create
        </button>
        <button className="cancel-button" onClick={() => navigate("/")}>
          Cancel
        </button>
      </form>
    </Card>
  );
};

export default CreateServer;
