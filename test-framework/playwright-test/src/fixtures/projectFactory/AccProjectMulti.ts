import { makeMultiPartnerProject } from "@innovateuk/project-factory";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";

export
@Fixture("accProjectMulti")
class AccProjectMulti extends ProjectFactory {
  getProject() {
    return makeMultiPartnerProject();
  }

  @Given("a multi-partner CR&D project exists")
  async multiProject() {
    await this.createProject();
  }
}
