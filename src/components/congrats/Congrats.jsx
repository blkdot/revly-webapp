import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './Congrats.scss';

const Congrats = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/dashboard');
    }, 5000);
  });

  return (
    <div className="congrats">
      <span>Congratulation !</span>
    </div>
  );
};

export default Congrats;
