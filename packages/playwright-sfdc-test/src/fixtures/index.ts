// fixtures.ts
import { test as base } from "playwright-bdd";
import { SfdcApi } from "./sfdc/SfdcApi";

type SfdcFixtures = {};

type SfdcWorkers = {
  sfdcApi: SfdcApi;
};

const test = base.extend<SfdcFixtures, SfdcWorkers>({
  sfdcApi: [SfdcApi.create, { scope: "worker" }],
});

export { test };
export { expect } from "@playwright/test";
