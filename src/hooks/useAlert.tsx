import { GlobalFunctionalitiesContext } from 'contexts';
import { useContext } from 'react';

export const useAlert = () => useContext(GlobalFunctionalitiesContext) as any;

export default useAlert;
