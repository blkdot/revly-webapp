import React, { createContext, useState, useMemo, useEffect } from 'react';

import { platformContexDefaultFormat } from '../data/platformList';

import config from '../setup/config';

export const PlatformContext = createContext();

const { environment } = config;

const defaultState = () => {
  if (environment !== 'dev') return platformContexDefaultFormat;

  const stringFakeOnboarding = localStorage.getItem('fakeOnboarding');

  if (!stringFakeOnboarding) return platformContexDefaultFormat;

  console.log(stringFakeOnboarding);
  return JSON.parse(stringFakeOnboarding);
};

export const PlatformProvider = ({ children }) => {
  const [userPlatformData, setUserPlatformData] = useState(defaultState());

  useEffect(() => {
    if (environment !== 'dev') return;

    localStorage.setItem('fakeOnboarding', JSON.stringify(userPlatformData));
  }, [userPlatformData]);

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
    [userPlatformData],
  );

  return <PlatformContext.Provider value={PlatformWrapper}>{children}</PlatformContext.Provider>;
};
