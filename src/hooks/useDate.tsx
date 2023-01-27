import { useContext } from 'react';

import { GlobalFunctionalitiesContext } from '../contexts/GlobalFunctionalitiesContext';

const useDate = () => useContext(GlobalFunctionalitiesContext);

export default useDate;
