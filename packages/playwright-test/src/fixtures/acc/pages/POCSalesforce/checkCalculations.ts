import { Page } from "@playwright/test";
import path from "path";
import { Fixture, Given } from "playwright-bdd/decorators";
import { SfdcApi } from "../../../sfdc/SfdcApi";
const fs = require("fs");

export
@Fixture("checkCalculations")
class CheckCalculations {
  protected readonly page: Page;
  protected readonly sfdcApi: SfdcApi;

  constructor({ page, sfdcApi }: { page: Page; sfdcApi: SfdcApi }) {
    this.page = page;
    this.sfdcApi = sfdcApi;
  }

  @Given("that the Claims Participant and Project calculations are correct")
  async somethingTrue() {
    console.log("Hello World");
  }
}
