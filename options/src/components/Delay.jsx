import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const Delay = ({ children, wait = 20 }) => {
  const timer = useRef(null);

  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    timer.current = setTimeout(() => {
      setWaiting(false);
    }, wait);

    return () => {
      clearTimeout(timer.current);
    };
  }, [setWaiting, wait]);

  if (waiting) {
    return null;
  }

  return children;
};
Delay.propTypes = {
  children: PropTypes.node,
  wait: PropTypes.number,
};

export default Delay;
