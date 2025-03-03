import { Page } from "@playwright/test";
import path from "path";
import { Fixture, Given } from "playwright-bdd/decorators";

export
@Fixture("checkQueueAssignments")
class CheckQueueAssignments {
  protected readonly page: Page;

  constructor({ page }: { page: Page }) {
    this.page = page;
  }

  @Given("that the Queues have been correctly assigned to the Claims")
  async somethingTrue() {
    console.log("Hello World");
  }
}
