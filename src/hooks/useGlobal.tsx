import { useContext } from 'react';
import { GlobalFunctionalitiesContext } from '../contexts/GlobalFunctionalitiesContext';

export const useGlobal = () => useContext(GlobalFunctionalitiesContext);

export default useGlobal;
