import { Fixture, Given, Then } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";
import { makeBaseProject } from "project-factory";
import { ProjectCard } from "../../components/ProjectCard";
import { expect, Page } from "@playwright/test";
import { ProjectState } from "./ProjectState";

export
@Fixture("accProjectBase")
class AccProjectBase extends ProjectFactory {
  getProject() {
    return makeBaseProject();
  }

  @Given("a standard CR&D project exists")
  async create() {
    await this.createProject();
  }

  @Given("the user is a {string}")
  async setUserTo(userType: "Monitoring Officer" | "Project Manager" | "Financial Consultant" | "MO" | "PM" | "FC") {
    const projectNumber = this.projectState.prefix;
    let userTypeShort = "";
    switch (userType) {
      case "Monitoring Officer":
      case "MO":
        userTypeShort = "mo";
        break;

      case "Project Manager":
      case "PM":
        userTypeShort = "pm";
        break;

      case "Financial Consultant":
      case "FC":
        userTypeShort = "fc";
        break;
    }

    const email = `${projectNumber}${userTypeShort}@x.gov.uk`;

    this.page.on("request", request => (request.headers["x-acc-userswitcher"] = email));
  }

  @Then("the user sees the project")
  async canSeeItem() {
    await expect(ProjectCard.fromTitle(this.page, this.prefix).get()).toBeVisible();
  }
}
