import { useContext } from 'react';
import { PlatformContext } from '../contexts/PlatformContext';

export const usePlatform = () =>
  useContext<{
    getActivePlatform: () => string | null;
    userPlatformData: {
      onboarded: boolean;
      platforms: {
        [x: string]: {
          registered: boolean;
          active: boolean;
          access_token: string;
          access_token_bis: string;
          vendor_ids: number[];
        }[];
      };
    };
    setUserPlatformData: React.Dispatch<
    React.SetStateAction<{
      onboarded: boolean;
      platforms: {
        [x: string]: {
          registered: boolean;
          active: boolean;
          access_token: string;
          access_token_bis: string;
          vendor_ids: number[];
        }[];
      };
    }>
    >;
    cleanPlatformData: () => void;
  }>(PlatformContext);

export default usePlatform;
