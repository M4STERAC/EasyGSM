import React from "react";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HashRouter, Route } from 'react-router-dom';
import MainPage from "./pages/MainPage";
// import NotFound from "./pages/NotFound";
import "./css/General.css";

const App = () => (
  <HashRouter>
    <Route exact path="/" component={MainPage} />
    {/* <Route component={NotFound} /> */}
  </HashRouter>
);

export default App;