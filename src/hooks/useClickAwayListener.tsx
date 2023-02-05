import { useEffect } from 'react';

const useClickAwayListener = (ref, onClickAway) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      onClickAway();
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
};

export default useClickAwayListener;
