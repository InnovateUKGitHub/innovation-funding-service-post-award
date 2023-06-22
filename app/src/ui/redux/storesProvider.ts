import { createContext, useContext } from "react";
import { RootActionsOrThunk } from "./actions/root";
import { RootState } from "./reducers/rootReducer";
import { AccountsStore } from "./stores/accountsStore";
import { ClaimDetailDocumentsStore } from "./stores/claimDetailDocumentsStore";
import { ClaimsDetailsStore } from "./stores/claimDetailsStore";
import { ClaimDocumentsStore } from "./stores/claimDocumentsStore";
import { ClaimOverridesStore } from "./stores/claimOverridesStore";
import { ClaimsStore } from "./stores/claimsStore";
import { CompaniesStore } from "./stores/companiesStore";
import { ConfigStore } from "./stores/configStore";
import { ContactsStore } from "./stores/contactsStore";
import { CostCategoriesStore } from "./stores/costCategoriesStore";
import { CostSummariesStore } from "./stores/costsSummariesStore";
import { ErrorStore } from "./stores/errorStore";
import { FinancialLoanVirementsStore } from "./stores/financialLoanVirementsStore";
import { FinancialVirementsStore } from "./stores/financialVirementsStore";
import { ForecastDetailsStore } from "./stores/forecastDetailsStore";
import { ForecastGolCostsStore } from "./stores/forecastGolCostsStore";
import { LoanDocumentsStore } from "./stores/loanDocumentsStore";
import { LoansStore } from "./stores/loanStore";
import { MessagesStore } from "./stores/messagesStore";
import { MonitoringReportsStore } from "./stores/monitoringReportsStore";
import { PartnerDocumentsStore } from "./stores/partnerDocumentsStore";
import { PartnersStore } from "./stores/partnersStore";
import { ProjectChangeRequestDocumentsStore } from "./stores/projectChangeRequestDocumentsStore";
import { ProjectChangeRequestStore } from "./stores/projectChangeRequestsStore";
import { ProjectDocumentsStore } from "./stores/projectDocumentsStore";
import { ProjectsStore } from "./stores/projectsStore";
import { UserStore } from "./stores/userStore";

export const createStores = ({
  getState,
  dispatch,
}: {
  getState: () => RootState;
  dispatch: (action: RootActionsOrThunk) => void;
}) => {
  const partnerDocuments = new PartnerDocumentsStore(getState, dispatch);
  const projects = new ProjectsStore(getState, dispatch);
  const partners = new PartnersStore(partnerDocuments, getState, dispatch);
  const costCategories = new CostCategoriesStore(partners, getState, dispatch);
  const costsSummaries = new CostSummariesStore(getState, dispatch);
  const errorDetails = new ErrorStore(getState, dispatch);
  const claimDocuments = new ClaimDocumentsStore(partners, getState, dispatch);
  const claims = new ClaimsStore(costsSummaries, claimDocuments, partners, getState, dispatch);
  const claimOverrides = new ClaimOverridesStore(getState, dispatch);
  const claimDetails = new ClaimsDetailsStore(getState, dispatch);
  const config = new ConfigStore(getState, dispatch);
  const forecastGolCosts = new ForecastGolCostsStore(getState, dispatch);
  const companies = new CompaniesStore(getState, dispatch);

  const loanDocuments = new LoanDocumentsStore(getState, dispatch);
  const loans = new LoansStore(loanDocuments, getState, dispatch);

  return {
    accounts: new AccountsStore(getState, dispatch),
    claimDetailDocuments: new ClaimDetailDocumentsStore(getState, dispatch),
    claimDetails,
    claimDocuments,
    claims,
    claimOverrides,
    companies,
    contacts: new ContactsStore(getState, dispatch),
    config,
    costCategories,
    costsSummaries,
    errorDetails,
    forecastDetails: new ForecastDetailsStore(
      claims,
      claimDetails,
      forecastGolCosts,
      partners,
      costCategories,
      getState,
      dispatch,
    ),
    financialVirements: new FinancialVirementsStore(getState, dispatch),
    financialLoanVirements: new FinancialLoanVirementsStore(getState, dispatch),
    forecastGolCosts,
    messages: new MessagesStore(getState, dispatch),
    monitoringReports: new MonitoringReportsStore(projects, getState, dispatch),
    projectChangeRequestDocuments: new ProjectChangeRequestDocumentsStore(getState, dispatch),
    projectChangeRequests: new ProjectChangeRequestStore(projects, partners, getState, dispatch),
    projectDocuments: new ProjectDocumentsStore(getState, dispatch),
    partnerDocuments: new PartnerDocumentsStore(getState, dispatch),
    projects,
    partners,
    users: new UserStore(getState, dispatch),
    loans,
    loanDocuments,
  };
};

export type IStores = ReturnType<typeof createStores>;

// initialised to null, will be set with stores when the Provider is instantiated
const storesContext = createContext<IStores>(null as unknown as IStores);

export const StoresProvider = storesContext.Provider;
/**
 * @deprecated Please use 'useStores' in favour of this HOC approach
 */
export const StoresConsumer = storesContext.Consumer;
export const useStores = () => useContext(storesContext);
