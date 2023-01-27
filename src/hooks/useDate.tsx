import { useContext } from 'react';

import { GlobalFunctionalitiesContext } from '../contexts/GlobalFunctionalitiesContext';

const useDate = () => useContext(GlobalFunctionalitiesContext) as any;

export default useDate;
