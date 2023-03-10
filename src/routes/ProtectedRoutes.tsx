/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserProvider } from 'contexts';
import { User } from 'firebase/auth';
import { FC, useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoutes: FC<{
  user: User | null;
}> = ({ user }) => {
  const value = useMemo(
    () => ({
      email: user?.email,
      token: (user as any)?.accessToken,
      displayName: user?.displayName,
      phoneNumber: user?.phoneNumber,
      emailVerified: user?.emailVerified,
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
