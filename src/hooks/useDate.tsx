import { GlobalFunctionalitiesContext } from 'contexts';
import { useContext } from 'react';

const useDate = () => useContext(GlobalFunctionalitiesContext) as any;

export default useDate;
