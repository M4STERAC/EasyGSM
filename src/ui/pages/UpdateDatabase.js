import React, { useState, useContext, useEffect } from "react";
import { createUTCDate, generateId } from "../utils/generalFunctions";
import {
  validateIpAddress,
  validatePort,
  validateFilePath,
  sanitizeAlphanumeric,
  sanitizeFilePath,
  sanitizePorts,
  sanitizeIpAddress,
} from "../utils/dataValidation";
import { executeScript } from "../utils/ipcExecutions";
import { StoreContext } from "../Store";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../components/Card";
import "../css/UpdateDatabase.css";

const UpdateDatabase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isUpdate = location.pathname === "/edit-server";
  const [state, setState] = useContext(StoreContext);
  const [id] = useState(isUpdate ? state.selectedServer.id : generateId(10));
  const [game, setGame] = useState(isUpdate ? state.selectedServer.game : "");
  const [name, setName] = useState(isUpdate ? state.selectedServer.name : "");
  const [executable, setExecutable] = useState(
    isUpdate ? state.selectedServer.executable : ""
  );
  const [saveDirectory, setSaveDirectory] = useState(
    isUpdate ? state.selectedServer.saveDirectory : ""
  );
  const [banlist, setBanlist] = useState(
    isUpdate ? state.selectedServer.banlist : ""
  );
  const [ports, setPorts] = useState(
    isUpdate ? state.selectedServer.ports : ""
  );
  const [backupTime, setBackupTime] = useState("06:00");
  const [errors, setErrors] = useState({
    errors: "",
    portError: "",
    pathError: "",
    requiredFieldsError: "",
  });

  useEffect(() => {
    if (errors) console.error(errors);
    if (errors) console.error(errors);
  }, [errors, errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let postFail = false;

    const banlistResult = validateIpAddress(banlist);
    console.log("Banlist validation Result: ", banlistResult);
    if (banlistResult !== true) {
      setErrors((prevState) => ({ ...prevState, banlistError: banlistResult }));
      postFail = true;
    } else setErrors((prevState) => ({ ...prevState, banlistError: "" }));

    const portResult = validatePort(ports);
    console.log("Port validation Result: ", portResult);
    if (portResult !== true) {
      setErrors((prevState) => ({ ...prevState, portError: portResult }));
      postFail = true;
    } else setErrors((prevState) => ({ ...prevState, portError: "" }));

    if (!validateFilePath(executable)) {
      setErrors((prevState) => ({
        ...prevState,
        pathError:
          "Invalid Path to Game Executable. Ensure the path is correct and it only contains alphanumeric characters, dashes, and/or underscores.",
      }));
      postFail = true;
    }
    if (!validateFilePath(saveDirectory)) {
      setErrors((prevState) => ({
        ...prevState,
        pathError:
          "Invalid Save Directory. Ensure the path is correct and it only contains alphanumeric characters, dashes, and/or underscores.",
      }));
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
        .then(() => {
          console.log("Opening Ports");
          executeScript({
            name: "OpenPorts.bat",
            args: `${game} ${ports.tcpinbound} ${ports.tcpoutbound} ${ports.udpinbound} ${ports.udpoutbound}`,
          });
          console.log("Successfully opened ports");
        })
        .then(() => {
          console.log("Creating Backup Schedule");
          executeScript({
            name: "CreateBackupSchedule.bat",
            args: `${game} ${backupTime} ${saveDirectory}`,
          });
          console.log("Successfully created backup schedule");
        })
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
      // .then(() => {
      //   executeScript({ name: "DeleteOpenPorts.bat", args: `${game}` });
      // })
      // .then(() => {
      //   executeScript({
      //     name: "DeleteBackupSchedule.bat",
      //     args: `${name}`,
      //   });
      // })
      .then(() => navigate("/"))
      .catch((error) => console.error(error));
  };

  return (
    <Card>
      {isUpdate && !state.selectedServer ? (
        <p className="error">
          Failed to get Server Configuration. Please try again later.
        </p>
      ) : (
        <div>
          <h2 className="card-title">
            {isUpdate ? "Update " : "Create "}Server
          </h2>
          <form onSubmit={handleSubmit} className="server-form">
            <label>Game:</label>
            <input
              type="text"
              value={game}
              onChange={(e) => setGame(sanitizeAlphanumeric(e.target.value))}
              placeholder={isUpdate ? game : "Elden Ring"}
            />
            <br />
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(sanitizeAlphanumeric(e.target.value))}
              placeholder={isUpdate ? name : "Elden Ring Server"}
            />
            <br />
            <label>Path to Game Executable:</label>
            <input
              type="text"
              value={executable}
              onChange={(e) => {
                setExecutable(sanitizeFilePath(e.target.value));
              }}
              placeholder={
                isUpdate
                  ? executable
                  : "C:\\Program Files\\Elden Ring\\EldenRing.exe"
              }
            />
            <br />
            <label>Save Directory:</label>
            <input
              type="text"
              value={saveDirectory}
              onChange={(e) => {
                setSaveDirectory(sanitizeFilePath(e.target.value));
              }}
              placeholder={
                isUpdate ? saveDirectory : "C:\\Program Files\\Elden Ring"
              }
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
              onChange={(e) => setBanlist(sanitizeIpAddress(e.target.value))}
              placeholder={isUpdate ? banlist : "255.255.255.255"}
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
                      setPorts({ ...ports, tcpinbound: sanitizePorts(e.target.value) })
                    }
                    placeholder={isUpdate ? ports.tcpinbound : "8221, 27115"}
                  />
                </li>
                <li>
                  <label>TCP Outbound:</label>
                  <input
                    type="text"
                    value={ports.tcpoutbound}
                    onChange={(e) => 
                      setPorts({ ...ports, tcpoutbound: sanitizePorts(e.target.value) })
                    }
                    placeholder={isUpdate ? ports.tcpoutbound : "8221, 27115"}
                  />
                </li>
                <li>
                  <label>UDP Inbound:</label>
                  <input
                    type="text"
                    value={ports.udpinbound}
                    onChange={(e) =>
                      setPorts({ ...ports, udpinbound: sanitizePorts(e.target.value) })
                    }
                    placeholder={isUpdate ? ports.udpinbound : "8221, 27115"}
                  />
                </li>
                <li>
                  <label>UDP Outbound:</label>
                  <input
                    type="text"
                    value={ports.udpoutbound}
                    onChange={(e) =>
                      setPorts({ ...ports, udpoutbound: sanitizePorts(e.target.value) })
                    }
                    placeholder={isUpdate ? ports.udpoutbound : "8221, 27115"}
                  />
                </li>
              </ul>
            </div>
            {errors.requiredFieldsError ? (
              <p className="error">{errors.requiredFieldsError}</p>
            ) : null}
            {errors.pathError ? (
              <p className="error">{errors.pathError}</p>
            ) : null}
            {errors.banlistError ? (
              <p className="error">{errors.banlistError}</p>
            ) : null}
            {errors.portError ? (
              <p className="error">{errors.portError}</p>
            ) : null}
            <div className="button-container">
              <div className="submit-cancel-container">
                <button type="submit" className="submit-button">
                  {isUpdate ? "Update" : "Create"}
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
              </div>
              {isUpdate ? (
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteServer();
                  }}
                >
                  Delete
                </button>
              ) : null}
            </div>
          </form>
        </div>
      )}
    </Card>
  );
};

export default UpdateDatabase;
