import React, { createContext, useState } from 'react';

export const PlatformContext = createContext();

export const PlatformProvider = ({ children }) => {
  const [platformToken, setPlatformToken] = useState([]);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [platformOnboarded, setPlatformOnboarded] = useState([]);

  return (
    <PlatformContext.Provider
      value={{
        platformToken,
        setPlatformToken,
        isOnboarded,
        setIsOnboarded,
        platformOnboarded,
        setPlatformOnboarded,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};
