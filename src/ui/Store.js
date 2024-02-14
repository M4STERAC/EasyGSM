import React, { createContext, useState, useEffect } from "react";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [state, setState] = useState({
    serverList: [],
    selectedServer: null,
    runningJobs: [],
  });

  useEffect(() => {
    window.electron
      .invoke("get-data")
      .then((servers) => {
        setState((prevState) => ({ ...prevState, serverList: servers }));
        console.log("Database: ", servers);
        const schedulesToCreate = [];
        servers.forEach((server) => {
          if (
            schedulesToCreate.includes({
              source: server.saveDirectory,
              game: server.game,
              time: server.backuptime,
            })
          )
            return;
          schedulesToCreate.push({
            source: server.saveDirectory,
            game: server.game,
            time: server.backuptime,
          });
        });
        console.log("Schedules to create: ", schedulesToCreate);
        schedulesToCreate.forEach((schedule) => {
          window.electron
            .invoke("create-schedule", schedule)
            .then((data) => console.log(data))
            .catch((error) => console.error("Create Schedule Error: ", error));
        });
      })
      .catch((error) => console.error("Get Database Error: ", error));
  }, []);

  return (
    <StoreContext.Provider value={[state, setState]}>
      {children}
    </StoreContext.Provider>
  );
};
