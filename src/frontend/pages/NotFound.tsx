import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';


//Default 404 page
const NotFound = () => {
  const theme = useTheme();

  return (
  <div style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: theme.palette.text.primary }}>
    <h2>404</h2>
    <p>The route you entered could not be found. Sorry!</p>
    <p>If this should have gone somewhere, please submit an issue <a style={{ color: 'blue', cursor: 'pointer' }} onClick={() => window.open('https://github.com/M4STERAC/EasyGSM/issues/new', '_blank')}>HERE</a></p>
    <p>-EasyGSM Team</p>
  </div>
)};

export default NotFound;