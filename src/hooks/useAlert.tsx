import { useContext } from 'react';
import { GlobalFunctionalitiesContext } from '../contexts/GlobalFunctionalitiesContext';

export const useAlert = () => useContext(GlobalFunctionalitiesContext) as any;

export default useAlert;
