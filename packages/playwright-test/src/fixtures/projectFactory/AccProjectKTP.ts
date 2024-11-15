import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";
import { makeKtpProject } from "@innovateuk/project-factory";

export
@Fixture("accProjectKtp")
class AccProjectKtp extends ProjectFactory {
  getProject() {
    return makeKtpProject();
  }

  @Given("a multi-partner KTP project exists")
  async ktpProject() {
    await this.createProject();
  }
}
