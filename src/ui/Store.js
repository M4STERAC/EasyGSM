import React, { createContext, useState, /* useEffect */ } from "react";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [state, setState] = useState({
    // Your initial state here
  });
  console.log("Store Loaded");

  // useEffect(() => {
  //   fetch("http://localhost:3001/Server")
  //     .then((response) => response.json())
  //     .then((data) =>
  //       setState((prevState) => ({ ...prevState, serverList: data }))
  //     )
  //     .catch((error) => console.error("Error:", error));
  // }, []);

  return (
    <StoreContext.Provider value={[state, setState]}>
      {children}
    </StoreContext.Provider>
  );
};
