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

  const PlatformWrapper = useMemo(
    () => ({
      userPlatformData,
      setUserPlatformData,
      cleanPlatformData,
    }),
    [userPlatformData]
  );

  return <PlatformContext.Provider value={PlatformWrapper}>{children}</PlatformContext.Provider>;
};
