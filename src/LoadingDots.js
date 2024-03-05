import React, { useState, useEffect } from 'react';

function LoadingDots() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) {
          return '';
        } else {
          return prevDots + '.';
        }
      });
    }, 300); 

    return () => clearInterval(interval);
  }, []);

  return <div className='loading'>Loading{dots}</div>;
}

export default LoadingDots;
