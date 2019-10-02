import React from "react";
import { RootState } from "./reducers";
import * as Stores from "./stores";
import { RootActionsOrThunk } from "./actions";

export const createStores = (getState: () => RootState, dispatch: (action: RootActionsOrThunk) => void) => {
  const projects = new Stores.ProjectsStore(getState, dispatch);
  const partners = new Stores.PartnersStore(getState, dispatch);
  const claims = new Stores.ClaimsStore(getState, dispatch);

  return {
    claims,
    config: new Stores.ConfigStore(getState, dispatch),
    contacts: new Stores.ContactsStore(getState, dispatch),
    documents: new Stores.DocumentsStore(partners, claims, getState, dispatch),
    messages: new Stores.MsssagesStore(getState, dispatch),
    monitoringReports: new Stores.MonitoringReportsStore(projects, getState, dispatch),
    navigation: new Stores.NavigationStore(getState, dispatch),
    projectChangeRequests: new Stores.ProjectChangeRequestStore(projects, getState, dispatch),
    projects,
    partners,
    users: new Stores.UserStore(getState, dispatch),
  };
};

export type IStores = ReturnType<typeof createStores>;

const StoresContext = React.createContext<IStores>(null as any);

export const StoresProvider = StoresContext.Provider;
export const StoresConsumer = StoresContext.Consumer;
