import { AccountDto } from "@framework/dtos/accountDto";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

export type IPreloadedDataContext = {
  data: {
    jesSearchResults: AccountDto[] | null;
  };

  clearItem: (field: keyof IPreloadedDataContext["data"]) => void;
  clearAll: () => void;
};

const defaultState: IPreloadedDataContext["data"] = {
  jesSearchResults: null,
};

const PreloadedDataContext = createContext<IPreloadedDataContext>({
  data: defaultState,
  clearItem: () => {},
  clearAll: () => {},
} as IPreloadedDataContext);

export const PreloadedDataContextProvider = ({
  children,
  preloadedData,
}: {
  children: ReactNode;
  preloadedData: Nullable<IPreloadedDataContext["data"]>;
}) => {
  const [data, setData] = useState<IPreloadedDataContext["data"]>(preloadedData ?? defaultState);

  const preloadedDataContext: IPreloadedDataContext = {
    data,
    clearItem(field: keyof IPreloadedDataContext["data"]) {
      setData(state => ({ ...state, [field]: null }));
    },
    clearAll() {
      setData(() => defaultState);
    },
  };
  return <PreloadedDataContext.Provider value={preloadedDataContext}>{children}</PreloadedDataContext.Provider>;
};

export const usePreloadedDataContext = () => useContext(PreloadedDataContext);

/**
 * Hook will clear all messages on route change
 * @param routePath The path of the current route
 */
export const useClearPreloadedDataOnRouteChange = (routePath: string) => {
  const { clearAll } = usePreloadedDataContext();
  useEffect(() => {
    clearAll();
  }, [routePath]);
};
