import { Fixture, Given, Then } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";
import { makeBaseProject } from "project-factory";
import { ProjectCard } from "../../components/ProjectCard";
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
    await expect(ProjectCard.fromTitle(this.page, this.prefix).get()).toBeVisible();
  }
}
