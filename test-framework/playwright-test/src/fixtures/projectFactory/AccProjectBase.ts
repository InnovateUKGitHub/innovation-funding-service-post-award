import { makeBaseProject } from "@innovateuk/project-factory";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";

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
}
