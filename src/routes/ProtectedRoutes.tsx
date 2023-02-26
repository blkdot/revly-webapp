/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from 'firebase/auth';
import { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type UserContextType = {
  email: string;
  token: string;
  displayName: string;
  phoneNumber: string;
};

const UserContext = createContext<UserContextType>({
  email: '',
  token: '',
  displayName: '',
  phoneNumber: '',
});

export const UserProvider: FC<{
  value: UserContextType;
  children: ReactNode;
}> = ({ value, children }) => <UserContext.Provider value={value}>{children}</UserContext.Provider>;

export const useUser = () => useContext(UserContext);

export const ProtectedRoutes: FC<{
  user: User;
}> = ({ user }) => {
  const value = useMemo(
    () => ({
      email: user.email,
      token: (user as any).accessToken,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
    }),
    [user]
  );

  if (!user) {
    return <Navigate replace to='/' />;
  }

  return (
    <UserProvider value={value}>
      <Outlet />
    </UserProvider>
  );
};
