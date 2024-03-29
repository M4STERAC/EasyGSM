import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Titlebar from './components/Titlebar';
import MainPage from "./pages/MainPage";
import NotFound from "./pages/NotFound";
import Box from "@mui/material/Box";
import Menu from './components/Menu';
import { Integrations } from "@sentry/tracing";
import { StoreProvider } from "./Store";
import * as Sentry from "@sentry/react";
import { darkTheme, lightTheme } from "./utils/themes";
import './css/Scrollbar.css';

//MUI Items
import { Theme, ThemeProvider } from '@mui/material/styles';


const number: number = Math.floor(Math.random() * 100) + 1;
// const selectedTheme: Theme = number % 2 === 0 ? lightTheme : darkTheme;
const selectedTheme: Theme = darkTheme;


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
        <ThemeProvider theme={selectedTheme}>
          <Titlebar />
          <Box sx={{
            marginTop: '40px', 
            paddingTop: { xs: '-20px', lg: '-10px'},
            paddingLeft: '1.5em',
            paddingRight: '1.5em',
            height: 'calc(100vh - 40px)',
            overflowY: 'auto',
            bottom: '0',
            backgroundColor: selectedTheme.palette.background.default,
          }}>
            <Menu />
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </ThemeProvider>
      </Router>
    </StoreProvider>
  );
};


export default App;