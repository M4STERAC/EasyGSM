import React, { useState } from "react";
import { createUTCDate } from "../utils/generalFunctions";
import { useNavigate } from "react-router-dom";

const CreateServer = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [saveDirectory, setSaveDirectory] = useState("");
  const [banlist, setBanlist] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let i = 0; i < 3; i++) {
      try {
        fetch("http://localhost:3001/Servers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            saveDirectory,
            banlist,
            uptime: 0,
            status: "Down",
            players: 0,
            lastrestart: await createUTCDate(),
            lastupdate: await createUTCDate(),
          }),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error("Error:", error));
        break;
      } catch (error) {
        console.error(error);
        if (i >= 3) console.errer("Failed to create server withing 3 attempts. Please try again later.");
      }
    }
    navigate.push("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Game:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Elden Ring"
        />
      </label>
      <br />
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Elden Ring Server 1"
        />
      </label>
      <br />
      <label>
        Path to Game Executable:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="C:\Program Files (x86)\Steam\steamapps\common\EldenRing\EldenRing.exe"
        />
      </label>
      <br />
      <label>
        Save Directory:
        <input
          type="text"
          value={saveDirectory}
          onChange={(e) => setSaveDirectory(e.target.value)}
          placeholder="C:\Users\mrman\AppData\Roaming\EldenRing\76561198108742533"
        />
      </label>
      <br />
      <label>
        Banlist:
        <input
          type="text"
          value={banlist}
          onChange={(e) => setBanlist(e.target.value)}
          placeholder="255.255.255.255, 255.255.255.254"
        />
      </label>
      <br />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateServer;
