import { useContext } from 'react';

import { DateContext } from '../contexts/DateContext';

export const useDate = () => {
  return useContext(DateContext);
};

export default useDate;
