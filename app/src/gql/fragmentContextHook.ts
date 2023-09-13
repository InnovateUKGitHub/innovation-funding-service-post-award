import { createContext, useContext } from "react";

// cannot know beforehand what the context will be
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FragmentContext = createContext<any>(undefined);

const useFragmentContext = function <T>() {
  return useContext<T>(FragmentContext);
};

export { useFragmentContext, FragmentContext };
