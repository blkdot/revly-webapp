import React, { createContext, useState } from 'react';

export const PlatformContext = createContext();

export const PlatformProvider = ({ children }) => {
  const [platformToken, setPlatformToken] = useState(null);

  return (
    <PlatformContext.Provider
      value={{
        platformToken,
        setPlatformToken,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};
