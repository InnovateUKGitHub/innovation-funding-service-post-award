import express from "express";
import * as contacts from "./contacts";
import * as costCategories from "./costCategories";
import * as projects from "./projects";
import * as partners from "./partners";
import * as claims from "./claims";
import * as projectContacts from "./projectContacts";
import * as claimLineItems from "./claimLineItems";
import * as claimDetails from "./claimDetails";
import * as claimDetailsSummary from "./claimDetailsSummary";
import * as forecastDetails from "./forecastDetails";
import * as forecastGolCosts from "./forecastGolCosts";
import * as documents from "./documents";
import * as users from "./users";

import {ControllerBase} from "./controllerBase";

export interface IApiClient {
  claimDetails: claimDetails.IClaimDetailsApi;
  claimDetailsSummary: claimDetailsSummary.IClaimDetailsSummaryApi;
  claimLineItems: claimLineItems.IClaimLineItemApi;
  claims: claims.IClaimsApi;
  contacts: contacts.IContactsApi;
  costCategories: costCategories.ICostCategoriesApi;
  documents: documents.IDocumentsApi;
  forecastDetails: forecastDetails.IForecastDetailsApi;
  forecastGolCosts: forecastGolCosts.IForecastGolCostsApi;
  projects: projects.IProjectsApi;
  projectContacts: projectContacts.IProjectContactsApi;
  partners: partners.IPartnersApi;
  users: users.IUserApi;
}

export const serverApis: IApiClient & { [key: string]: ControllerBase<{}> } = {
  claims: claims.controller,
  claimDetails: claimDetails.controller,
  claimDetailsSummary: claimDetailsSummary.controller,
  claimLineItems: claimLineItems.controller,
  contacts: contacts.controller,
  costCategories: costCategories.controller,
  documents: documents.controller,
  forecastDetails: forecastDetails.controller,
  forecastGolCosts: forecastGolCosts.controller,
  partners: partners.controller,
  projects: projects.controller,
  projectContacts: projectContacts.controller,
  users: users.controller,
};

export const router = express.Router();

Object.keys(serverApis)
  .map(key => ({ path: serverApis[key].path, controller: serverApis[key] }))
  .forEach(item => router.use("/" + item.path, item.controller.router));

router.all("*", (req, res, next) => res.status(404).send());
