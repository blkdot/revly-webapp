import { GlobalFunctionalitiesContext } from 'contexts';
import { useContext } from 'react';

export const useGlobal = () => useContext(GlobalFunctionalitiesContext);

export default useGlobal;
