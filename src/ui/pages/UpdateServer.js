import React, { useState, useContext } from "react";
import { createUTCDate } from "../utils/generalFunctions";
import { StoreContext } from "../Store";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import "../css/CreateServer.css";

const UpdateServer = () => {
  const navigate = useNavigate();
  const [state, setState] = useContext(StoreContext);
  const [game, setGame] = useState(state.selectedServer.game);
  const [name, setName] = useState(state.selectedServer.name);
  const [executable, setExecutable] = useState(state.selectedServer.executable);
  const [saveDirectory, setSaveDirectory] = useState(state.selectedServer.saveDirectory);
  const [banlist, setBanlist] = useState(state.selectedServer.banlist);
  const [updateFail, setUpdateFail] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/Server", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: state.selectedServer.id,
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

  const deleteServer = () => {
    console.log(state.selectedServer.id);
    fetch(`http://localhost:3001/Server/${state.selectedServer.id}`, {
      method: "DELETE"
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
              placeholder={state.selectedServer.game}
            />
            <br />
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={state.selectedServer.name}
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
              placeholder={state.selectedServer.executable}
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
              placeholder={state.selectedServer.saveDirectory}
            />
            <br />
            <label>Banlist:</label>
            <input
              type="text"
              value={banlist}
              onChange={(e) => setBanlist(e.target.value)}
              placeholder={state.selectedServer.banlist.toString()}
            />
            <br />
            {updateFail ? (
              <p className="error">
                Failed to update/delete server. Please validate input data.
              </p>
            ) : null}
            <div className="button-container">
              <button type="submit" className="submit-button">
                Create
              </button>
              <button className="cancel-button" onClick={() => navigate("/")}>
                Cancel
              </button>
              <button
                className="delete-button"
                onClick={() => deleteServer()}
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
