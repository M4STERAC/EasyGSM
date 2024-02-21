import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import NotFound from "./pages/NotFound";
import UpdateDatabase from "./pages/UpdateDatabase";
import Footer from "./components/Footer";
import "./css/General.css";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/browser";
import { StoreProvider } from "./Store";

//Sentry setup for error tracking
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

//React Router setup
const App = () => {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/add-server" element={<UpdateDatabase />} />
          <Route path="/edit-server" element={<UpdateDatabase />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </StoreProvider>
  );
};

export default App;
