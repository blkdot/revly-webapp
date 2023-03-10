import { GlobalFunctionalitiesContext } from 'contexts';
import { useContext } from 'react';

export const useAlert = () => useContext(GlobalFunctionalitiesContext);

export default useAlert;
