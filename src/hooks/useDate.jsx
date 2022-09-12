import { useContext } from 'react';

import { GlobalFunctionalitiesContext } from '../contexts/GlobalFunctionalitiesContext';

export const useDate = () => {
  return useContext(GlobalFunctionalitiesContext);
};

export default useDate;
