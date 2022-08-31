import React, { createContext, useState } from 'react';

export const AccessTokenContext = createContext();

export const AccessTokenProvider = ({ children }) => {
  const [platformToken, setPlatformToken] = useState(null);
  const [isOnBoarded, setIsOnBoarded] = useState(false);
  return (
    <AccessTokenContext.Provider
      value={{
        platformToken,
        setPlatformToken,
        isOnBoarded,
        setIsOnBoarded,
      }}
    >
      {children}
    </AccessTokenContext.Provider>
  );
};


