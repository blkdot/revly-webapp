import { createContext, FC, ReactNode, useContext } from 'react';

type UserContextType = {
  email: string;
  token: string;
  displayName: string;
  phoneNumber: string;
  emailVerified: boolean;
};

const UserContext = createContext<UserContextType>({
  email: '',
  token: '',
  displayName: '',
  phoneNumber: '',
  emailVerified: false,
});

export const UserProvider: FC<{
  value: UserContextType;
  children: ReactNode;
}> = ({ value, children }) => <UserContext.Provider value={value}>{children}</UserContext.Provider>;

export const useUser = () => useContext(UserContext);
