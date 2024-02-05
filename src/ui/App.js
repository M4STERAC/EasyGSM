import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import MainPage from "./pages/MainPage";
import NotFound from "./pages/NotFound";
import CreateServer from "./pages/CreateServer";
import "./css/General.css";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/browser";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0
});

const router = createHashRouter([
  {
    path: "/",
    element: <MainPage />,
    // loader: rootLoader,
    children: [
      {
        path: "*",
        element: <NotFound />,
        // loader: teamLoader,
      },
      {
        path: "/add-server",
        element: <CreateServer />,
        // loader: teamLoader,
      },
    ],
  },
]);

console.log("loaded app.js");

function App() {
  return <RouterProvider router={router} />;
}

export default App;
