import { Fixture, Given, Then } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";
import { makeBaseProject } from "project-factory";
import { DashboardCard } from "../../components/DashboardCard";
import { expect } from "@playwright/test";

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

  @Then("the user sees the project")
  async canSeeItem() {
    await expect(DashboardCard.fromTitle(this.page, this.prefix).selector()).toBeVisible();
  }
}
