import { expect, Locator, Page } from "@playwright/test";
import { Fixture, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { PcrType } from "../../../../Typings/pcr";
import { Button } from "../../../../components/Button";

export
@Fixture("projectChangeRequests")
class ProjectChangeRequests {
  protected readonly page: Page;
  protected readonly commands: Commands;
  private readonly createButton: Locator;
  private readonly pcrTypeHeading: Locator;

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;
    this.createButton = Button.fromTitle(page, "Create request");
    this.pcrTypeHeading = this.page.getByRole("heading");
  }

  /**
   * This assumes the user is on the Start a request page and can see all PCR checkboxes.
   */
  @When("the user creates a {string} PCR")
  async createPCR(pcr: PcrType) {
    await this.page.getByLabel(pcr).click();
    await this.createButton.click();
    await expect(this.pcrTypeHeading).toHaveText(pcr);
  }
}
