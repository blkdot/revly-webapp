import React, { useEffect, useState } from 'react';

import './Timer.scss';

const Timer = ({ onEnd }) => {
  const [count, setCount] = useState(20);

  useEffect(() => {
    const timer = count > 0 && setInterval(() => setCount(count - 1), 1000);
    if (count === 0) onEnd();
    return () => clearInterval(timer);
  }, [count]);

  return <span className="timer">({count}s)</span>;
};

export default Timer;
