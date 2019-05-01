import express from "express";
import * as claims from "./claims";
import * as claimDetails from "./claimDetails";
import * as costsSummary from "./costsSummary";
import * as costCategories from "./costCategories";
import * as documents from "./documents";
import * as forecastDetails from "./forecastDetails";
import * as forecastGolCosts from "./forecastGolCosts";
import * as monitoringReports from "./monitoringReports";
import * as partners from "./partners";
import * as projects from "./projects";
import * as projectContacts from "./projectContacts";
import * as users from "./users";
import * as version from "./version";

import { ControllerBase } from "./controllerBase";
import { errorHandlerApi } from "../errorHandlers";
import { NotFoundError } from "../features/common/appError";

export interface IApiClient {
  claimDetails: claimDetails.IClaimDetailsApi;
  costsSummary: costsSummary.ICostsSummaryApi;
  claims: claims.IClaimsApi;
  costCategories: costCategories.ICostCategoriesApi;
  documents: documents.IDocumentsApi;
  forecastDetails: forecastDetails.IForecastDetailsApi;
  forecastGolCosts: forecastGolCosts.IForecastGolCostsApi;
  monitoringReports: monitoringReports.IMonitoringReportsApi;
  projects: projects.IProjectsApi;
  projectContacts: projectContacts.IProjectContactsApi;
  partners: partners.IPartnersApi;
  users: users.IUserApi;
  version: version.IVersionApi;
}

export const serverApis: IApiClient & { [key: string]: ControllerBase<{}> } = {
  claims: claims.controller,
  claimDetails: claimDetails.controller,
  costsSummary: costsSummary.controller,
  costCategories: costCategories.controller,
  documents: documents.controller,
  forecastDetails: forecastDetails.controller,
  forecastGolCosts: forecastGolCosts.controller,
  monitoringReports: monitoringReports.controller,
  partners: partners.controller,
  projects: projects.controller,
  projectContacts: projectContacts.controller,
  users: users.controller,
  version: version.controller,
};

export const router = express.Router();

Object.keys(serverApis)
  .map(key => ({ path: serverApis[key].path, controller: serverApis[key] }))
  .forEach(item => router.use("/" + item.path, item.controller.router));

router.all("*", (req, res) => errorHandlerApi(res, new NotFoundError()));
