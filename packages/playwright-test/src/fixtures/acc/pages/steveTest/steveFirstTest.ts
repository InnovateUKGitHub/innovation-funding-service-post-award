import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { Page } from "@playwright/test";
import { Fixture, Given } from "playwright-bdd/decorators";

export
@Fixture("steveTest")
class SteveTest {
  protected readonly page: Page;

  constructor({ page }: { page: Page }) {
    this.page = page;
  }

  @Given("there is a salesforce connection")
  async salesforceConnection() {
    console.log("Hello world!");
  }
}
