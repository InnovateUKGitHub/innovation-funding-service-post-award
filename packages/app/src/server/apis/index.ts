import express from "express";
import { getErrorResponse, getErrorStatus } from "@framework/util/errorHandlers";
import { NotFoundError } from "../features/common/appError";
import * as claims from "./claims";
import * as claimDetails from "./claimDetails";
import * as documents from "./documents";
import * as financialVirements from "./financialVirements";
import * as financialLoanVirements from "./financialLoanVirements";
import * as forecastDetails from "./forecastDetails";
import * as initialForecastDetails from "./initialForecastDetails";
import * as loans from "./loans";
import * as monitoringReports from "./monitoringReports";
import * as pcrs from "./pcrs";
import * as partners from "./partners";
import * as projectContacts from "./projectContacts";

export interface IApiClient<Context extends "client" | "server"> {
  claimDetails: claimDetails.IClaimDetailsApi<Context>;
  claims: claims.IClaimsApi<Context>;
  documents: documents.IDocumentsApi<Context>;
  financialVirements: financialVirements.IFinancialVirement<Context>;
  financialLoanVirements: financialLoanVirements.IFinancialLoanVirement<Context>;
  forecastDetails: forecastDetails.IForecastDetailsApi<Context>;
  initialForecastDetails: initialForecastDetails.IInitialForecastDetailsApi<Context>;
  loans: loans.ILoansApi<Context>;
  monitoringReports: monitoringReports.IMonitoringReportsApi<Context>;
  pcrs: pcrs.IPCRsApi<Context>;
  projectContacts: projectContacts.IProjectContactsApi<Context>;
  partners: partners.IPartnersApi<Context>;
}

export const serverApis = {
  claims: claims.controller,
  claimDetails: claimDetails.controller,
  documents: documents.controller,
  financialVirements: financialVirements.controller,
  financialLoanVirements: financialLoanVirements.controller,
  forecastDetails: forecastDetails.controller,
  initialForecastDetails: initialForecastDetails.controller,
  loans: loans.controller,
  monitoringReports: monitoringReports.controller,
  pcrs: pcrs.controller,
  partners: partners.controller,
  projectContacts: projectContacts.controller,
} as const;

export const router = express.Router();

(Object.keys(serverApis) as (keyof typeof serverApis)[])
  .map(key => ({ path: serverApis[key].path, controller: serverApis[key] }))
  .forEach(item => router.use("/" + item.path, item.controller.router));

router.all("*", (req, res) => {
  const error = new NotFoundError();
  res.status(getErrorStatus(error)).json(getErrorResponse(error, res.locals.traceId));
});
