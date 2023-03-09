import { createContext, FC, ReactNode, useContext } from 'react';

export type VendorsContextType = unknown[];

const VendorsContext = createContext<VendorsContextType>([]);

export const VendorsProvider: FC<{
  value: VendorsContextType;
  children: ReactNode;
}> = ({ value, children }) => (
  <VendorsContext.Provider value={value}>{children}</VendorsContext.Provider>
);

export const useVendors = () => useContext(VendorsContext);
