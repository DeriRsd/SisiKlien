//my-react-app\src\Components\Card.jsx
import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div className={`w-full bg-white rounded-2xl shadow-lg p-8 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
