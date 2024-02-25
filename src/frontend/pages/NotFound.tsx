import React from 'react';
import { Link } from 'react-router-dom';
import log from 'electron-log/renderer';

//Default 404 page
const NotFound = () => {
  log.error("404 page accessed");
  
  return (
  <div>
    <p>404. The route you entered could not be found. Sorry!</p>
    <p>If this should have gone somewhere, please submit an issue <a href="https://github.com/M4STERAC/EasyGSM/issues/new">HERE</a></p>
    <p>-EasyGSM Team</p>
    <Link to="/">Back to Main</Link>
  </div>
)};

export default NotFound;