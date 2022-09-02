import { useContext } from 'react';

import { GlobalFunctionalitiesContext } from '../contexts/GlobalFunctionalitiesContext';

export const useAlert = () => {
  return useContext(GlobalFunctionalitiesContext);
};

export default useAlert;
