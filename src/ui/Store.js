import React, { createContext, useState, useEffect } from "react";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [state, setState] = useState({
    serverList: [],
    selectedServer: null,
  });
  console.log("Store Loaded");

  useEffect(() => {
    window.electron
      .invoke('get-data')
      .then((data) => setState((prevState) => ({ ...prevState, serverList: data })))
      .then(() => console.log('Database: ', state.serverList))
      .catch((error) => console.error(error));
  }, []);

  return (
    <StoreContext.Provider value={[state, setState]}>
      {children}
    </StoreContext.Provider>
  );
};
