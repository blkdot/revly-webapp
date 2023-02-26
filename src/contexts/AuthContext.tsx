import { createContext, useContext, useMemo, useState } from 'react';

const UserAuthContext = createContext<{
  isUpdatingPhone: any;
  setIsUpdatingPhone: any;
}>(undefined);

export const AuthContextProvider = ({ children }) => {
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);

  const value = useMemo(
    () => ({
      isUpdatingPhone,
      setIsUpdatingPhone,
    }),
    [isUpdatingPhone]
  );

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
};

export const useUserAuth = () => useContext(UserAuthContext);
