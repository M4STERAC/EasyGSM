import React from "react";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HashRouter, Route } from "react-router-dom";
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
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

const router = createHashRouter([
  {
    path: "/",
    element: <MainPage />,
    // loader: rootLoader,
    // children: [
    //   {
    //     path: "*",
    //     element: <NotFound />,
    //     // loader: teamLoader,
    //   },
    // ],
  },
]);

console.log("loaded app.js");
// const App = () => (
//   <Sentry.ErrorBoundary fallback={"An error has occurred"}>
//     <HashRouter basename="/">
//       <Route exact path="/" component={MainPage} />
//       {/* <Route component={NotFound} /> */}
//     </HashRouter>
//   </Sentry.ErrorBoundary>
// );


function App() {
  return <RouterProvider router={router} />;
}
  



export default App;
