import { GlobalFunctionalitiesContext } from 'contexts';
import { useContext } from 'react';

const useDate = () => useContext(GlobalFunctionalitiesContext);

export default useDate;
