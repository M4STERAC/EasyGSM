import React from 'react';
import '../css/Card.css';

//Component that contains any information given to it and wraps it STYYYYYLLLEEE
const Card = ({ children }) => (
  <div className="card">
    {children}
  </div>
);

export default Card;