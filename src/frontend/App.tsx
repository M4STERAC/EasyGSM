import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Titlebar from './components/Titlebar';
import MainPage from "./pages/MainPage";
import NotFound from "./pages/NotFound";
import UpdateDatabase from "./components/UpdateDatabase";
import Footer from "./components/Footer";
import License from "./components/License";
import Box from "@mui/material/Box";
import Menu from './components/Menu';
import { Integrations } from "@sentry/tracing";
import { StoreProvider } from "./Store";
import * as Sentry from "@sentry/react";
import darkTheme from "./utils/themes";
import './css/Scrollbar.css';

//MUI Items
import { Theme, ThemeProvider } from '@mui/material/styles';



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
              <Route path="/add-server" element={<UpdateDatabase />} />
              <Route path="/edit-server" element={<UpdateDatabase />} />
              <Route path="/license" element={<License />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </Box>
        </ThemeProvider>
      </Router>
    </StoreProvider>
  );
};


export default App;