import React from "react";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HashRouter, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
// import NotFound from "./pages/NotFound";
import "./css/General.css";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/browser";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0, // Adjust this value to control the percentage of transactions sent
});

console.log("loaded app.js");
const App = () => (
  <Sentry.ErrorBoundary fallback={"An error has occurred"}>
    <HashRouter>
      <Route exact path="/" component={MainPage} />
      {/* <Route component={NotFound} /> */}
    </HashRouter>
  </Sentry.ErrorBoundary>
);

export default App;
