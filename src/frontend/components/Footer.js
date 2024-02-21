import React from 'react';
import logo from '../images/EasyGSMLogo.png';
import '../css/Footer.css';

//Footer component loaded at the bottom of each page
const Footer = () => (
  <div className="footer">
    <div className="footer-logo">
      <img src={logo} alt="EasyGSM Logo" />
    </div>
    <div className="footer-text">
      <p>EasyGSM is an open source software. Please credit
      https://github.com/M4STERAC/EasyGSM as the first author of the
      program in all areas where credit is due.</p>

      <p>Report an issue <a href="https://github.com/M4STERAC/EasyGSM/issues/new">HERE</a></p>
    </div>
  </div>
);

export default Footer;