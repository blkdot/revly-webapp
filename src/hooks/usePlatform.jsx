import { useContext } from 'react';

import { PlatformContext } from '../contexts/PlatformContext';

export const usePlatform = () => {
  return useContext(PlatformContext);
};

export default usePlatform;
