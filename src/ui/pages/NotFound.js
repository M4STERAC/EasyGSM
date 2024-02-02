import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div>
    <p>404. The route you entered could not be found. Sorry !</p>
    <p>EasyGSM Team</p>
    <Link to="/">Back to Main</Link>
  </div>
);

export default NotFound;