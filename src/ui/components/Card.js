import React from 'react';
import '../css/card.css';

const Card = ({ children }) => (
  <div className="card">
    {children}
  </div>
);

export default Card;