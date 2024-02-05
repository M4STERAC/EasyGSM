import React, { useState } from "react";
import { createUTCDate } from "../utils/generalFunctions";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../components/Card";
import "../css/CreateServer.css";

const UpdateServer = () => {
//   const location = useLocation();
//   const selectedServer = location.state.selectedServer;
  const navigate = useNavigate();
  const [game, setGame] = useState("");
  const [name, setName] = useState("");
  const [executable, setExecutable] = useState("");
  const [saveDirectory, setSaveDirectory] = useState("");
  const [banlist, setBanlist] = useState("");
  const [updateFail, setUpdateFail] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/Server", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // selectedServer.id,
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
        setUpdateFail(true);
      });
  };

  return (
    <Card>
      {/* { !selectedServer ? <p className="error">Failed to get Server Configuration. Please try again later.</p> : */}
        <div>
          <form onSubmit={handleSubmit} className="server-form">
            <label>Game:</label>
            <input
              type="text"
              value={game}
              onChange={(e) => setGame(e.target.value)}
              placeholder={selectedServer.game}
            />
            <br />
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={selectedServer.name}
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
              placeholder={selectedServer.executable}
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
              placeholder={selectedServer.saveDirectory}
            />
            <br />
            <label>Banlist:</label>
            <input
              type="text"
              value={banlist}
              onChange={(e) => setBanlist(e.target.value)}
              placeholder={selectedServer.banlist.toString()}
            />
            <br />
            {updateFail ? (
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
        </div>
      {/* } */}
    </Card>
  );
};

export default UpdateServer;
