import React, { useState, useContext, useEffect } from "react";
import { createUTCDate, generateId } from "../utils/generalFunctions";
import {
  validateIpAddress,
  validatePort,
  validateFilePath,
  validateRequiredFieldsFilled,
  sanitizeAlphanumeric,
  sanitizeFilePath,
  sanitizePorts,
  sanitizeIpAddress,
} from "../utils/dataValidation";
import { Error } from "../utils/types";
import {
  onboardServer,
  offboardServer,
} from "../utils/onboard-offboard-server";
import { StoreContext } from "../Store";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "./Card";
import "../css/UpdateDatabase.css";
import "../css/ButtonStyles.css";
import "../css/Forms.css";

const UpdateDatabase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isUpdate = location.pathname === "/edit-server";
  const [state, setState] = useContext(StoreContext);
  const [id] = useState(isUpdate ? state.selectedServer.id : generateId(10));
  const [game, setGame] = useState(isUpdate ? state.selectedServer.game : "");
  const [name, setName] = useState(isUpdate ? state.selectedServer.name : "");
  const [executable, setExecutable] = useState(isUpdate ? state.selectedServer.executable : "");
  const [saveDirectory, setSaveDirectory] = useState(isUpdate ? state.selectedServer.saveDirectory : "");
  const [banlist, setBanlist] = useState(isUpdate ? state.selectedServer.banlist : "");
  const [ports, setPorts] = useState(isUpdate ? state.selectedServer.ports : "");
  const [backuptime, setBackupTime] = useState("06:00");
  const [errors, setErrors] = useState({ banlistError: "", portError: "", pathError: "", requiredFieldsError: "" } as Error);


  //Whenever an error is created, log it to the console
  useEffect(() => {
    const errs = Object.values(errors).toString().replaceAll(/[,\s]/g, "");
    if (errs !== "") console.error(errors);
  }, [errors]);


  //When the user submits the form, validate the data and save it to the database
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let postFail = false;

    //Validate all input fields
    const requiredFieldsValidated = validateRequiredFieldsFilled(game, name, executable, saveDirectory);
    const banlistValidated = validateIpAddress(banlist);
    const portsValidated = validatePort(ports);
    const executableValidated = validateFilePath(executable);
    const saveDirectoryValidated = validateFilePath(saveDirectory);

    //If any of the fields are invalid, set the errors and return
    if (requiredFieldsValidated !== true || portsValidated !== true || banlistValidated !== true || executableValidated !== true || saveDirectoryValidated !== true) {
      setErrors((prevState: any) => ({ 
        ...prevState, 
        requiredFieldsError: requiredFieldsValidated !== true ? requiredFieldsValidated : "",
        banlistError: banlistValidated !== true ? banlistValidated : "",
        portError: portsValidated !== true ? portsValidated : "",
        pathError: (executableValidated !== true ? executableValidated : "") || (saveDirectoryValidated !== true ? saveDirectoryValidated : ""),
      }));
      postFail = true;
      return;
    } else postFail = false;

    if (postFail) return;
    //Post the database
    window.electron.invoke("save-server", {
      id,
      game,
      name,
      executable,
      saveDirectory,
      banlist,
      ports,
      backuptime,
    })
    .then((data: Server) => {
      setState((prevState: any) => {
        const serverList = prevState.serverList;
        const index = serverList.findIndex((server: Server) => server.id === data.id);
        data.status = "Down";
        if (index === -1) serverList.push(data);
        else serverList[index] = data;
        return { ...prevState, serverList, selectedServer: null };
      });
      console.debug("Onboard Result: ", onboardServer({
        game,
        ports,
        backuptime,
        saveDirectory,
      } as Server));
    })
    .then(() => navigate("/"))
    .catch((error: any) => console.error(error));
  };

  const deleteServer = () => {
    //Ask the user if they're sure they want to delete the server and/or the ports
    window.electron.invoke("dialog-box", {
      checkboxLabel: "Would you like to delete the open ports used for this server?",
      checkboxChecked: false,
    })
    .then((response: DialogBoxRespone) => {
      if (response.response !== 0) return;
      //Delete the server and/or the ports
      window.electron.invoke("delete-server", { id })
      .then(() => {
        setState((prevState: any) => {
          const serverList = prevState.serverList;
          const index = serverList.findIndex((server: Server) => server.id === id);
          if (index !== -1) serverList.splice(index, 1);
          return { ...prevState, serverList, selectedServer: null };
        })
        console.debug("Offboard Result: ", offboardServer(
          { game, ports, backuptime, saveDirectory } as Server,
          response.checkboxChecked
        ));
      })
      .then(() => navigate("/"))
      .catch((error: any) => console.error('Delete Server Error: ', error));
    })
    .catch((error: any) => console.error('Dialog Box Error: ', error));
  };

  return (
    <Card>
      {isUpdate && !state.selectedServer ? (<p className="error">Failed to get Server Configuration. Please try again later.</p>) 
      : (
        <div>
          <h2 className="card-title">{ isUpdate ? "Update " : "Create " }Server</h2>
          <form onSubmit={handleSubmit} className="form">
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
              onChange={(e) => setExecutable(sanitizeFilePath(e.target.value))}
              placeholder={isUpdate ? executable : "C:\\Program Files\\Elden Ring\\EldenRing.exe"}
            />
            <br />

            <label>Save Directory:</label>
            <input
              type="text"
              value={saveDirectory}
              onChange={(e) => setSaveDirectory(sanitizeFilePath(e.target.value))}
              placeholder={isUpdate ? saveDirectory : "C:\\Program Files\\Elden Ring"}
            />
            <br />

            <label>Backup Time:</label>
            <input
              type="time"
              value={backuptime}
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

            <p>Required Ports: </p>
            <ul>

              <li>
                <label>TCP Inbound:</label>
                <input
                  type="text"
                  value={ports.tcpinbound}
                  onChange={(e) => setPorts({ ...ports, tcpinbound: sanitizePorts(e.target.value) })}
                  placeholder={isUpdate ? ports.tcpinbound : "8221, 27115"}
                />
              </li>

              <li>
                <label>TCP Outbound:</label>
                <input
                  type="text"
                  value={ports.tcpoutbound}
                  onChange={(e) => setPorts({ ...ports, tcpoutbound: sanitizePorts(e.target.value) })}
                  placeholder={isUpdate ? ports.tcpoutbound : "8221, 27115"}
                />
              </li>

              <li>
                <label>UDP Inbound:</label>
                <input
                  type="text"
                  value={ports.udpinbound}
                  onChange={(e) => setPorts({ ...ports, udpinbound: sanitizePorts(e.target.value) })}
                  placeholder={isUpdate ? ports.udpinbound : "8221, 27115"}
                />
              </li>

              <li>
                <label>UDP Outbound:</label>
                <input
                  type="text"
                  value={ports.udpoutbound}
                  onChange={(e) => setPorts({ ...ports, udpoutbound: sanitizePorts(e.target.value) })}
                  placeholder={isUpdate ? ports.udpoutbound : "8221, 27115"}
                />
              </li>
            </ul>

            {/* List all errors */}
            { Object.values(errors).map((error) => <p key={error} className="error">{ error }</p>) }

            <div className="button-container">
              <div className="submit-cancel-container">
                <button type="submit" className="submit-button">{ isUpdate ? "Update" : "Create" }</button>
                <button className="cancel-button" onClick={(e) => {
                    e.preventDefault();
                    navigate("/");
                }}>
                  Cancel
                </button>
              </div>
              {isUpdate ? (
                <button className="delete-button" onClick={(e) => {
                  e.preventDefault();
                  deleteServer();
                }}>
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
