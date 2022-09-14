import { useContext } from 'react';

import { PlatformContext } from '../contexts/PlatformContext';

export const usePlatform = () => useContext(PlatformContext);

export default usePlatform;
