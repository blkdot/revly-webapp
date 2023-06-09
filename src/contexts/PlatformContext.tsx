import { createContext, useContext, useMemo, useState } from 'react';
import { platformContextDefaultFormat, TPlatformUserData } from '../data/platformList';

export type PlatformContextType = {
  getActivePlatform: () => string | null;
  cleanPlatformData: () => void;
  userPlatformData: TPlatformUserData;
  setUserPlatformData: (v: TPlatformUserData) => void;
  exception: string[];
};

const PlatformContext = createContext<PlatformContextType>(undefined);

const defaultState = () => platformContextDefaultFormat;

export const PlatformProvider = ({ children }) => {
  const [userPlatformData, setUserPlatformData] = useState(defaultState());

  const cleanPlatformData = () => {
    if (JSON.stringify(userPlatformData) === JSON.stringify(platformContextDefaultFormat)) return;

    setUserPlatformData(platformContextDefaultFormat);
  };
  const exception = ['careem', 'noon'];
  const getActivePlatform = (): string | null => {
    let activePlatform: string | null = null;

    Object.keys(userPlatformData.platforms).forEach((pl) => {
      if (userPlatformData.platforms[pl].some((obj) => obj.active) && !exception.includes(pl)) {
        activePlatform = pl;
      }
    });

    return activePlatform;
  };

  const value = useMemo(
    () => ({
      userPlatformData,
      setUserPlatformData,
      cleanPlatformData,
      getActivePlatform,
      exception,
    }),
    [userPlatformData]
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
};

export const usePlatform = () => useContext(PlatformContext);
