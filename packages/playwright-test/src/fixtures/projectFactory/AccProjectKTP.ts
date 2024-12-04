import {
  TwoParticipantKTPProjectFactoryScript,
  TwoParticipantKTPProjectFactoryScriptArguments,
  TwoParticipantKTPProjectFactoryScriptContext,
} from "@innovateuk/project-factory-two/scripts/TwoParticipantKTPProjectFactoryScript";
import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";

export
@Fixture("accProjectKtp")
class AccProjectKtp extends ProjectFactory<
  TwoParticipantKTPProjectFactoryScriptContext,
  TwoParticipantKTPProjectFactoryScriptArguments
> {
  getScript({ connection }: { connection: ITsforceConnection }) {
    return new TwoParticipantKTPProjectFactoryScript({ connection });
  }

  @Given("a multi-partner KTP project exists")
  async ktpMultiProject() {
    await this.createProject({ generateProfiles: false });
  }

  @Given("a multi-partner KTP project with profiles exists")
  async ktpMultiProjectWithProfiles() {
    await this.createProject({ generateProfiles: true });
  }
}
