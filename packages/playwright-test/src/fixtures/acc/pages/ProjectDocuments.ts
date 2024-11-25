import { Page } from "@playwright/test";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../Commands";
import { Validators } from "../../validators";

export
@Fixture("projectDocuments")
class ProjectDocuments {
  private readonly page: Page;
  private readonly commands: Commands;
  private readonly validators: Validators;

  constructor({ page, commands, validators }: { page: Page; commands: Commands; validators: Validators }) {
    this.page = page;
    this.commands = commands;
    this.validators = validators;
  }

  @Given("the user can see the Documents heading")
  async isPage() {
    this.commands.heading("Project documents");
  }

  @When("the user uploads a file in the documents area")
  async uploadFile() {
    await this.validators.testFileComponent("project", "Project overview", "Documents", false, false, "Plans");
    await this.validators.docTypeDropdown("Plans");
    await this.page.locator("css=#description").selectOption("Plans");
    await this.commands.fileInput(["testfile.doc"]);
  }

  @Then("a document table will be visible")
  async documentIsVisible() {
    await this.page.locator("css=td").getByRole("link").filter({ hasText: "testfile.doc" }).isVisible();
    await this.commands.deleteFileFromRow("testfile.doc");
  }
}
