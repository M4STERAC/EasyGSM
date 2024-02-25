import React from 'react';
import logo from '../images/EasyGSMLogo.png';
import { Link } from 'react-router-dom';
import '../css/Footer.css';
import '../css/Links.css';

//Footer component loaded at the bottom of each page
const Footer = () => (
  <div className="footer">
    <div className="footer-logo">
      <img src={logo} alt="EasyGSM Logo" />
    </div>
    <div className="footer-text">
      <p>EasyGSM is an open source software used to make automating commissioning, managing, and decommissioning game servers easy.</p>
      <p>Developed by: <a className="link" href="https://github.com/M4STERAC">Matthew Manka</a></p>
      <p>View source code: <a className="link" href="https://github.com/M4STERAC/EasyGSM">HERE</a></p>
      <p>Please read the <Link className="link" to="/license">license</Link></p>
      <p>Go back <Link className="link" to="/">Home</Link></p>
      <p>Report an issue <a className="link" href="https://github.com/M4STERAC/EasyGSM/issues/new">HERE</a></p>
    </div>
  </div>
);

export default Footer;