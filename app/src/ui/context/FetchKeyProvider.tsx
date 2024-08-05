import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

const fetchKeyState = createContext<[number, Dispatch<SetStateAction<number>>]>([
  0,
  () => {
    throw new Error("noop");
  },
]);

const FetchKeyProvider = ({ children }: { children: ReactNode }) => {
  const x = useState<number>(0);

  return <fetchKeyState.Provider value={x}>{children}</fetchKeyState.Provider>;
};

const useFetchKey = () => {
  const data = useContext(fetchKeyState);
  if (!data) throw new Error("useFetchKey() must be used within a FetchKeyProvider");
  return data;
};

export { useFetchKey, FetchKeyProvider };
