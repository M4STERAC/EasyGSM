import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import "./css/general.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main className="general-style"/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;