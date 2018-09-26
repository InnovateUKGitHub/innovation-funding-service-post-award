import express from "express";
import * as claimCosts from "./claimCosts";
import * as contacts from "./contacts";
import * as costCategories from "./costCategories";
import * as projects from "./projects";
import * as partners from "./partners";
import * as claims from "./claims";
import * as projectContacts from "./projectContacts";
import * as claimLineItems from "./claimLineItems";
import * as claimDetails from "./claimDetails";
import {ControllerBase} from "./controllerBase";

export interface IApiClient {
  claimCosts: claimCosts.IClaimCostsApi;
  claimLineItems: claimLineItems.IClaimLineItemApi;
  claimDetails: claimDetails.IClaimDetailsApi;
  contacts: contacts.IContactsApi;
  costCategories: costCategories.ICostCategoriesApi;
  projects: projects.IProjectsApi;
  projectContacts: projectContacts.IProjectContactsApi;
  partners: partners.IPartnersApi;
  claims: claims.IClaimsApi;
}

export const serverApis: IApiClient & { [key: string]: ControllerBase<{}> } = {
  claimCosts: claimCosts.controller,
  claimLineItems: claimLineItems.controller,
  claimDetails: claimDetails.controller,
  contacts: contacts.controller,
  costCategories: costCategories.controller,
  partners: partners.controller,
  projects: projects.controller,
  projectContacts: projectContacts.controller,
  claims: claims.controller
};

export const router = express.Router();

Object.keys(serverApis)
  .map(key => ({ path: serverApis[key].path || key, controller: serverApis[key] }))
  .forEach(item => router.use("/" + item.path, item.controller.router));

router.all("*", (req, res, next) => res.status(404).send());
