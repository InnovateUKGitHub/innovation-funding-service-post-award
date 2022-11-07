import { createContext, useContext } from "react";
import { RootState } from "./reducers";
import * as Stores from "./stores";
import { RootActionsOrThunk } from "./actions";

export const createStores = (getState: () => RootState, dispatch: (action: RootActionsOrThunk) => void) => {
  const partnerDocuments = new Stores.PartnerDocumentsStore(getState, dispatch);
  const projects = new Stores.ProjectsStore(getState, dispatch);
  const partners = new Stores.PartnersStore(partnerDocuments, getState, dispatch);
  const costCategories = new Stores.CostCategoriesStore(partners, getState, dispatch);
  const costsSummaries = new Stores.CostSummariesStore(getState, dispatch);
  const errorDetails = new Stores.ErrorStore(getState, dispatch);
  const claimDocuments = new Stores.ClaimDocumentsStore(partners, getState, dispatch);
  const claims = new Stores.ClaimsStore(costsSummaries, claimDocuments, partners, getState, dispatch);
  const claimDetails = new Stores.ClaimsDetailsStore(getState, dispatch);
  const config = new Stores.ConfigStore(getState, dispatch);
  const forecastGolCosts = new Stores.ForecastGolCostsStore(getState, dispatch);
  const companies = new Stores.CompaniesStore(getState, dispatch);

  const loanDocuments = new Stores.LoanDocumentsStore(getState, dispatch);
  const loans = new Stores.LoansStore(loanDocuments, getState, dispatch);

  return {
    accounts: new Stores.AccountsStore(getState, dispatch),
    broadcasts: new Stores.BroadcastsStore(getState, dispatch),
    claimDetailDocuments: new Stores.ClaimDetailDocumentsStore(getState, dispatch),
    claimDetails,
    claimDocuments,
    claims,
    companies,
    config: new Stores.ConfigStore(getState, dispatch),
    contacts: new Stores.ContactsStore(getState, dispatch),
    costCategories,
    costsSummaries,
    errorDetails,
    forecastDetails: new Stores.ForecastDetailsStore(
      claims,
      claimDetails,
      forecastGolCosts,
      partners,
      costCategories,
      getState,
      dispatch,
    ),
    financialVirements: new Stores.FinancialVirementsStore(getState, dispatch),
    financialLoanVirements: new Stores.FinancialLoanVirementsStore(getState, dispatch),
    forecastGolCosts,
    messages: new Stores.MessagesStore(getState, dispatch),
    monitoringReports: new Stores.MonitoringReportsStore(projects, getState, dispatch),
    projectChangeRequestDocuments: new Stores.ProjectChangeRequestDocumentsStore(getState, dispatch),
    projectChangeRequests: new Stores.ProjectChangeRequestStore(projects, config, getState, dispatch),
    projectDocuments: new Stores.ProjectDocumentsStore(getState, dispatch),
    partnerDocuments: new Stores.PartnerDocumentsStore(getState, dispatch),
    projects,
    partners,
    users: new Stores.UserStore(getState, dispatch),
    loans,
    loanDocuments,
  };
};

export type IStores = ReturnType<typeof createStores>;

// initialised to null, will be set with stores when the Provider is instantiated
const storesContext = createContext<IStores>(null as unknown as IStores);

/* eslint-disable @typescript-eslint/naming-convention */
export const StoresProvider = storesContext.Provider;
/**
 * @deprecated Please use 'useStores' in favour of this HOC approach
 */
export const StoresConsumer = storesContext.Consumer;
export const useStores = () => useContext(storesContext);
