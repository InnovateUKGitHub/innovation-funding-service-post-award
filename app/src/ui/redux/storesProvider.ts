import React from "react";
import { RootState } from "./reducers";
import * as Stores from "./stores";
import { RootActionsOrThunk } from "./actions";

export const createStores = (getState: () => RootState, dispatch: (action: RootActionsOrThunk) => void) => {
  const projects = new Stores.ProjectsStore(getState, dispatch);
  const partners = new Stores.PartnersStore(getState, dispatch);
  const claims = new Stores.ClaimsStore(getState, dispatch);
  const claimDetails = new Stores.ClaimsDetailsStore(getState, dispatch);
  const forecastGolCosts = new Stores.ForecastGolCostsStore(getState, dispatch);

  return {
    claimDetailDocuments: new Stores.ClaimDetailDocumentsStore(getState, dispatch),
    claimDetails,
    claimDocuments: new Stores.ClaimDocumentsStore(partners, claims, getState, dispatch),
    claims,
    config: new Stores.ConfigStore(getState, dispatch),
    contacts: new Stores.ContactsStore(getState, dispatch),
    costCategories: new Stores.CostCategoriesStore(getState, dispatch),
    forecastDetails: new Stores.ForecastDetailsStore(claims, claimDetails, forecastGolCosts, getState, dispatch),
    forecastGolCosts,
    messages: new Stores.MsssagesStore(getState, dispatch),
    monitoringReports: new Stores.MonitoringReportsStore(projects, getState, dispatch),
    navigation: new Stores.NavigationStore(getState, dispatch),
    projectChangeRequestDocuments: new Stores.ProjectChangeRequestDocumentsStore(getState, dispatch),
    projectChangeRequests: new Stores.ProjectChangeRequestStore(projects, getState, dispatch),
    projectDocuments: new Stores.ProjectDocumentsStore(getState, dispatch),
    projects,
    partners,
    users: new Stores.UserStore(getState, dispatch),
  };
};

export type IStores = ReturnType<typeof createStores>;

const StoresContext = React.createContext<IStores>(null as any);

export const StoresProvider = StoresContext.Provider;
export const StoresConsumer = StoresContext.Consumer;
