import { IRoutes } from "@ui/routing/routeConfig";
import { createContext, useContext } from "react";

const routesContext = createContext<IRoutes | undefined>(undefined);

/* eslint-disable @typescript-eslint/naming-convention */
export const RoutesProvider = routesContext.Provider;
export const RoutesConsumer = routesContext.Consumer;

export const useRoutes = () => {
  const context = useContext(routesContext);

  if (!context) {
    throw new Error("useRoutes() must be used within a <RoutesProvider />");
  }

  return context;
};
