import React from 'react';
import logo from '../images/EasyGSMLogo.png';
import '../css/Footer.css';
import { Link } from 'react-router-dom';

//Footer component loaded at the bottom of each page
const Footer = () => (
  <div className="footer">
    <div className="footer-logo">
      <img src={logo} alt="EasyGSM Logo" />
    </div>
    <div className="footer-text">
      <p>EasyGSM is an open source software used to make automating commissioning, managing, and decommissioning game servers easy.</p>
      <p>Developed by: <a href="https://github.com/M4STERAC">Matthew Manka</a></p>
      <p>View source code: <a href="https://github.com/M4STERAC/EasyGSM">HERE</a></p>
      <p>Please read the <Link to="/license">license</Link></p>
      <p>Report an issue <a href="https://github.com/M4STERAC/EasyGSM/issues/new">HERE</a></p>
    </div>
  </div>
);

export default Footer;