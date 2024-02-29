import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Toolbar from './components/Toolbar';
import MainPage from "./pages/MainPage";
import NotFound from "./pages/NotFound";
import UpdateDatabase from "./pages/UpdateDatabase";
import Footer from "./components/Footer";
import License from "./pages/License";
import "./css/General.css";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { StoreProvider } from "./Store";

//MUI Items
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


const customTheme = createTheme({ palette: {
  mode: 'dark', 
  primary: {
    light: '#757ce8',
    main: '#3f50b5',
    dark: '#002884',
    contrastText: '#fff',
  },
  secondary: {
    light: '#ff7961',
    main: '#f44336',
    dark: '#ba000d',
    contrastText: '#000',
  },
  text: {
    primary: '#fff',
    secondary: '#000',
  },
  error: {
    main: '#f44336',
  },
  warning: {
    main: '#ff9800',
  },
  info: {
    main: '#2196f3',
  },
  success: {
    main: '#4caf50',
  },
  background: {
    default: '#121212',
    paper: '#424242',
  },
  action: {
    active: '#fff',
    hover: '#616161',
    selected: '#757575',
    disabled: '#616161',
    disabledBackground: '#424242',
    focus: '#fff',
    hoverOpacity: 0.08,
    disabledOpacity: 0.38,
  }
}});


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
        <ThemeProvider theme={customTheme}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/add-server" element={<UpdateDatabase />} />
            <Route path="/edit-server" element={<UpdateDatabase />} />
            <Route path="/license" element={<License />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </ThemeProvider>
      </Router>
    </StoreProvider>
  );
};

export default App;
