import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import NotFound from "./pages/NotFound";
import UpdateDatabase from "./pages/UpdateDatabase";
import Footer from "./components/Footer";
import FirstLoad from "./pages/FirstLoad";
import License from "./pages/License";
import "./css/General.css";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { StoreProvider } from "./Store";

//Sentry setup for error tracking
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

//React Router setup
const App = () => {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/first-launch" element={<FirstLoad />} />
          <Route path="/add-server" element={<UpdateDatabase />} />
          <Route path="/edit-server" element={<UpdateDatabase />} />
          <Route path="/license" element={<License />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </StoreProvider>
  );
};

export default App;
