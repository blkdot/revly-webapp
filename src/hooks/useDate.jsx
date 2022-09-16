import { useContext } from 'react';

import { GlobalFunctionalitiesContext } from '../contexts/GlobalFunctionalitiesContext';

export const useDate = () => useContext(GlobalFunctionalitiesContext);

export default useDate;
