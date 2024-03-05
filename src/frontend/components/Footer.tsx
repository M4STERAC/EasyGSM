import React from 'react';
import { useTheme } from '@mui/material/styles';
import '../css/Footer.css';
import '../css/Links.css';

//Footer component loaded at the bottom of each page
const Footer = () => {
  const theme = useTheme();
  
  return (
  <div className="footer">
    <div className="footer-text">
      <p>EasyGSM is an open source software used to make automating commissioning, managing, and decommissioning game servers easy.</p>
    </div>
  </div>
)};

export default Footer;