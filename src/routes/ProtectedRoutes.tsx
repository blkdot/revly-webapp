/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserProvider } from 'contexts';
import { FC, useMemo, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth } from 'firebase-config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { SpinnerKit } from 'kits';

export const ProtectedRoutes: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>(null);

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

  useEffect(() => {
    setLoading(true);

    return onAuthStateChanged(auth, (u) => {
      setLoading(false);

      if (u) {
        setUser(u);
      } else {
        navigate('/');
      }
    });
  }, [navigate]);

  if (loading) {
    return (
      <div className='main-loading'>
        <SpinnerKit style={{ display: 'flex', margin: 'auto' }} />
      </div>
    );
  }

  return (
    <UserProvider value={value}>
      <Outlet />
    </UserProvider>
  );
};
