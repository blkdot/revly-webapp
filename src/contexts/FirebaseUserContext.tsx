import { User } from 'firebase/auth';
import { createContext, FC, ReactNode, useContext } from 'react';

const FirebaseUserContext = createContext<User>(undefined);

export const FirebaseUserProvider: FC<{
  value: User;
  children: ReactNode;
}> = ({ value, children }) => (
  <FirebaseUserContext.Provider value={value}>{children}</FirebaseUserContext.Provider>
);

export const useFirebaseUser = () => useContext(FirebaseUserContext);
