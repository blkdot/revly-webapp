import { useContext } from 'react';
import { type TPlatformUserData } from 'data/platformList';
import { PlatformContext } from 'contexts/PlatformContext';

export const usePlatform = () =>
  useContext<{
    getActivePlatform: () => string | null;
    userPlatformData: TPlatformUserData;
    setUserPlatformData: React.Dispatch<React.SetStateAction<TPlatformUserData>>;
    cleanPlatformData: () => void;
  }>(PlatformContext);

export default usePlatform;
