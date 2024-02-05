import React from "react";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from "./pages/MainPage";
import NotFound from "./pages/NotFound";
import CreateServer from "./pages/CreateServer";
import UpdateServer from "./pages/UpdateServer";
import "./css/General.css";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/browser";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

console.log("loaded app.js");

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/add-server" element={<CreateServer />} />
        <Route path="/update-server" element={<UpdateServer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
