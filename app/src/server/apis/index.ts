import express from "express";
import { getErrorResponse, getErrorStatus } from "@server/errorHandlers";
import { NotFoundError } from "../features/common/appError";
import * as accounts from "./accounts";
import * as claims from "./claims";
import * as claimOverrides from "./claimOverrides";
import * as claimDetails from "./claimDetails";
import * as companiesHouse from "./companies";
import * as costsSummary from "./costsSummary";
import * as costCategories from "./costCategories";
import * as documents from "./documents";
import * as financialVirements from "./financialVirements";
import * as financialLoanVirements from "./financialLoanVirements";
import * as forecastDetails from "./forecastDetails";
import * as initialForecastDetails from "./initialForecastDetails";
import * as forecastGolCosts from "./forecastGolCosts";
import * as loans from "./loans";
import * as monitoringReports from "./monitoringReports";
import * as pcrs from "./pcrs";
import * as partners from "./partners";
import * as projects from "./projects";
import * as projectContacts from "./projectContacts";
import * as users from "./users";

export interface IApiClient<Context extends "client" | "server"> {
  accounts: accounts.IAccountsApi<Context>;
  claimDetails: claimDetails.IClaimDetailsApi<Context>;
  costsSummary: costsSummary.ICostsSummaryApi<Context>;
  companies: companiesHouse.ICompaniesApi<Context>;
  claims: claims.IClaimsApi<Context>;
  claimOverrides: claimOverrides.IClaimOverridesApi<Context>;
  costCategories: costCategories.ICostCategoriesApi<Context>;
  documents: documents.IDocumentsApi<Context>;
  financialVirements: financialVirements.IFinancialVirement<Context>;
  financialLoanVirements: financialLoanVirements.IFinancialLoanVirement<Context>;
  forecastDetails: forecastDetails.IForecastDetailsApi<Context>;
  initialForecastDetails: initialForecastDetails.IInitialForecastDetailsApi<Context>;
  forecastGolCosts: forecastGolCosts.IForecastGolCostsApi<Context>;
  loans: loans.ILoansApi<Context>;
  monitoringReports: monitoringReports.IMonitoringReportsApi<Context>;
  pcrs: pcrs.IPCRsApi<Context>;
  projects: projects.IProjectsApi<Context>;
  projectContacts: projectContacts.IProjectContactsApi<Context>;
  partners: partners.IPartnersApi<Context>;
  users: users.IUserApi<Context>;
}

export const serverApis = {
  accounts: accounts.controller,
  claims: claims.controller,
  claimOverrides: claimOverrides.controller,
  claimDetails: claimDetails.controller,
  companies: companiesHouse.controller,
  costsSummary: costsSummary.controller,
  costCategories: costCategories.controller,
  documents: documents.controller,
  financialVirements: financialVirements.controller,
  financialLoanVirements: financialLoanVirements.controller,
  forecastDetails: forecastDetails.controller,
  initialForecastDetails: initialForecastDetails.controller,
  forecastGolCosts: forecastGolCosts.controller,
  loans: loans.controller,
  monitoringReports: monitoringReports.controller,
  pcrs: pcrs.controller,
  partners: partners.controller,
  projects: projects.controller,
  projectContacts: projectContacts.controller,
  users: users.controller,
} as const;

export const router = express.Router();

(Object.keys(serverApis) as (keyof typeof serverApis)[])
  .map(key => ({ path: serverApis[key].path, controller: serverApis[key] }))
  .forEach(item => router.use("/" + item.path, item.controller.router));

router.all("*", (req, res) => {
  const error = new NotFoundError();
  res.status(getErrorStatus(error)).json(getErrorResponse(error));
});
