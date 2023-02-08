/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useMemo, useState } from 'react';
import { platformContexDefaultFormat } from '../data/platformList';

export const PlatformContext = createContext(undefined);

const defaultState = () => platformContexDefaultFormat;

export const PlatformProvider = ({ children }) => {
  const [userPlatformData, setUserPlatformData] = useState(defaultState());

  const cleanPlatformData = () => {
    if (JSON.stringify(userPlatformData) === JSON.stringify(platformContexDefaultFormat)) return;

    setUserPlatformData(platformContexDefaultFormat);
  };

  const getActivePlatform = (): string | null => {
    let activePlatform: string | null = null;

    Object.keys(userPlatformData.platforms).forEach((pl) => {
      if (userPlatformData.platforms[pl].find((obj) => obj.active)) {
        activePlatform = pl;
      }
    });

    return activePlatform;
  };

  const PlatformWrapper = useMemo(
    () => ({
      userPlatformData,
      setUserPlatformData,
      cleanPlatformData,
      getActivePlatform,
    }),
    [userPlatformData]
  );

  return <PlatformContext.Provider value={PlatformWrapper}>{children}</PlatformContext.Provider>;
};
