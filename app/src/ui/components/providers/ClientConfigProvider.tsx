import { IClientConfig } from "../../../types/IClientConfig";
import { createContext, ReactNode, useContext } from "react";

const siteOptions = createContext<null | IClientConfig>(null);

const ClientConfigProvider = ({ config, children }: { config: IClientConfig; children: ReactNode }) => (
  <siteOptions.Provider value={config}>{children}</siteOptions.Provider>
);

const useClientConfig = () => {
  const data = useContext(siteOptions);
  if (!data) throw new Error("useClientConfig() must be used within a SiteOptionsProvider");
  return data;
};

export { useClientConfig, ClientConfigProvider };
