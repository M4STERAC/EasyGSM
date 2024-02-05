import React, { useState } from "react";
import axios from "axios";
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
        const response = await axios.post("http://localhost:3001/Servers", {
          name,
          saveDirectory,
          banlist,
          uptime: 0,
          status: "Down",
          players: 0,
          lastrestart: await createUTCDate(),
          lastupdate: await createUTCDate(),
        });

        console.log(response.data); // Handle the response as needed
      } catch (error) {
        console.error(error);
        if (i >= 3) console.errer('Failed to create server withing 3 attempts. Please try again later.');
      }
    }
    navigate.push('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Save Directory:
        <input
          type="text"
          value={saveDirectory}
          onChange={(e) => setSaveDirectory(e.target.value)}
        />
      </label>
      <br />
      <label>
        Banlist:
        <input
          type="text"
          value={banlist}
          onChange={(e) => setBanlist(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateServer;
