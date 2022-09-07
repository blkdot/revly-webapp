import { createContext, useState } from "react";

export const DateContext = createContext();

const DateContextProvider = ({ children }) => {
  const [leftDate, setLeft] = useState({ startDate: new Date(), endDate: new Date() });
  const [rightDate, setRight] = useState({ startDate: new Date(), endDate: new Date() });
  return (
    <DateContext.Provider value={{ leftDate, rightDate, setLeft, setRight }}>
      {children}
    </DateContext.Provider>
  );
}

export default DateContextProvider;
