import React, { createContext, useState } from 'react';

export const PlatformContext = createContext();

export const PlatformProvider = ({ children }) => {
  const [platformToken, setPlatformToken] = useState([]);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [platformOnboarded, setPlatformOnboarded] = useState([]);

  console.log('Platform Tokens => ', platformToken);
  console.log('Is onboarded => ', isOnboarded);
  console.log('List platform onboarded => ', platformOnboarded);

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
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};
