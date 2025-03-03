import { Page } from "@playwright/test";
import path from "path";
import { Fixture, Given } from "playwright-bdd/decorators";

export
@Fixture("checkCalculations")
class CheckCalculations {
  protected readonly page: Page;

  constructor({ page }: { page: Page }) {
    this.page = page;
  }

  @Given("that the Claims Participant and Project calculations are correct")
  async somethingTrue() {
    console.log("Hello World");
  }
}
