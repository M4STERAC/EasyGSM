import React, { createContext, useState, useEffect } from "react";

//Create context for context API
export const StoreContext: React.Context<any> = createContext({} as any);

export const StoreProvider = ({ children }: any) => {
  //Initial State
  const [state, setState] = useState({
    serverList: [],
    selectedServer: null,
    runningJobs: [],
  });

  //Get data from database and create backup schedules
  useEffect(() => {
    window.electron.invoke("get-data").then((servers: Server[]) => {
      setState((prevState: any) => ({ ...prevState, serverList: servers }));
      const schedulesToCreate: Schedule[] = [];
      servers.forEach((server) => {
        if (!schedulesToCreate.includes({
            source: server.saveDirectory,
            game: server.game,
            time: server.backuptime,
          })
        ) schedulesToCreate.push({
          source: server.saveDirectory,
          game: server.game,
          time: server.backuptime,
        });
      });
      schedulesToCreate.forEach((schedule) => {
        window.electron.invoke("create-schedule", schedule)
          .catch((error: any) => console.error("Create Schedule Error: ", error));
      });
    }).catch((error: any) => console.error("Get Database Error: ", error));
  }, []);

  return (
    <StoreContext.Provider value={[state, setState]}>
      {children}
    </StoreContext.Provider>
  );
};
