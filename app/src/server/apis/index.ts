import express, { Router } from "express";
import * as claimCosts from "./claimCosts";
import * as contacts from "./contacts";
import * as costCategories from "./costCategories";
import * as projects from "./projects";
import * as partners from "./partners";
import * as projectContacts from "./projectContacts";

export interface IApiClient {
  claimCosts: claimCosts.IClaimCostsApi,
  contacts: contacts.IContactsApi;
  costCategories: costCategories.ICostCategoriesApi;
  projects: projects.IProjectsApi;
  projectContacts: projectContacts.IProjectContactsApi;
  partners: partners.IPartnersApi;
}

export const serverApis: IApiClient & { [key: string]: { router: Router } } = {
  claimCosts: claimCosts.controller,
  contacts: contacts.controller,
  costCategories: costCategories.controller,
  partners: partners.controller,
  projects: projects.controller,
  projectContacts: projectContacts.controller,
};

export const router = express.Router();

Object.keys(serverApis)
  .map(key => ({ path: key, controller: serverApis[key] }))
  .forEach(item => router.use("/" + item.path, item.controller.router));

router.all("*", (req, res, next) => res.status(404).send());
