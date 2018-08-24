import express from "express";

import { ControllerBase } from "./controllerBase";

import * as contacts from "./contacts";
import * as projects from "./projects";
import * as partners from "./partners";
import * as projectContacts from "./projectContacts";

export interface IApiClient {
  contacts: contacts.IContactsApi;
  projects: projects.IProjectsApi;
  projectContacts: projectContacts.IProjectContactsApi;
  partners: partners.IPartnersApi;
}

export const serverApis: IApiClient & { [key: string]: ControllerBase<{}> } = {
  contacts: contacts.controller,
  partners: partners.controller,
  projects: projects.controller,
  projectContacts: projectContacts.controller,
};

export const router = express.Router();

Object.keys(serverApis)
  .map(key => ({ path: key, controller: serverApis[key] }))
  .forEach(item => router.use("/" + item.path, item.controller.router));

router.all("*", (req, res, next) => res.status(404).send());
