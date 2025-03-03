import { Page } from "@playwright/test";
import path from "path";
import { Fixture, Given } from "playwright-bdd/decorators";
import { SfdcApi } from "../../../sfdc/SfdcApi";
const fs = require("fs");

export
@Fixture("pocSalesforce")
class PocSalesforce {
  protected readonly page: Page;
  protected readonly sfdcApi: SfdcApi;

  constructor({ page, sfdcApi }: { page: Page; sfdcApi: SfdcApi }) {
    this.page = page;
    this.sfdcApi = sfdcApi;
  }

  @Given("there is a CRnD Project with twelve Approved Claims")
  async createCRndProject() {
    const conn = this.sfdcApi.getTsforceConnection();
  }
}
