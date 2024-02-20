import React from 'react';
import '../css/Card.css';

const Card = ({ children }) => (
  <div className="card">
    {children}
  </div>
);

export default Card;