import { auth } from 'firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { SpinnerKit } from 'kits';
import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

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

export const ProtectedRoutesNew: FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserContextType>({
    email: '',
    token: '',
    displayName: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    return onAuthStateChanged(auth, (u) => {
      setLoading(false);

      if (u) {
        setUser({
          email: u.email,
          token: (u as any).accessToken,
          displayName: u.displayName,
          phoneNumber: u.phoneNumber,
        });
      } else {
        navigate('/');
      }
    });
  }, [navigate]);

  if (loading) {
    return <SpinnerKit />;
  }

  return (
    <UserProvider value={user}>
      <Outlet />
    </UserProvider>
  );
};
