import { ReactNode, createContext, useContext } from "react";

// cannot know beforehand what the context will be
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FragmentContext = createContext<any>(undefined);

const useFragmentContext = function <T>() {
  return useContext<T>(FragmentContext);
};

interface FragmentContextProviderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fragment: any;
  children: ReactNode;
}

const FragmentContextProvider = ({ fragment, children }: FragmentContextProviderProps) => {
  return <FragmentContext.Provider value={fragment}>{children}</FragmentContext.Provider>;
};

export { useFragmentContext, FragmentContext, FragmentContextProvider };
