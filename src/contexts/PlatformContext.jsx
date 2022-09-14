// TODO: fix all linter problem
/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState } from 'react';

export const PlatformContext = createContext();

export const PlatformProvider = ({ children }) => {
  const [platformToken, setPlatformToken] = useState([]);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [platformOnboarded, setPlatformOnboarded] = useState([]);

  const clearToken = () => {
    setPlatformToken([]);
    setIsOnboarded(false);
    setPlatformOnboarded([]);
  };

  return (
    <PlatformContext.Provider
      value={{
        platformToken,
        setPlatformToken,
        isOnboarded,
        setIsOnboarded,
        platformOnboarded,
        setPlatformOnboarded,
        clearToken,
      }}>
      {children}
    </PlatformContext.Provider>
  );
};
