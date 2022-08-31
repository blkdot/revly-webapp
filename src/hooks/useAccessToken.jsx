import { useContext } from 'react';

import { AccessTokenContext } from '../contexts/AccessTokenContext';

export const useAccessToken = () => {
  return useContext(AccessTokenContext);
};

export default useAccessToken;
