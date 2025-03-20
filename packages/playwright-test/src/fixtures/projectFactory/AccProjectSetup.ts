import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";
import {
  TwoParticipantProjectSetupScript,
  TwoParticipantProjectSetupScriptArguments,
  TwoParticipantProjectSetupScriptContext,
} from "@innovateuk/project-factory-two/scripts/TwoParticipantProjectSetupScript";
import { ITsforceConnection } from "@innovateuk/tsforce/index";

export
@Fixture("accProjectSetup")
class AccProjectSetup extends ProjectFactory<
  TwoParticipantProjectSetupScriptContext,
  TwoParticipantProjectSetupScriptArguments
> {
  getScript({ connection }: { connection: ITsforceConnection }) {
    return new TwoParticipantProjectSetupScript({ connection });
  }

  @Given("a multi-partner CR&D project exists in Project setup state")
  async crndMultiProjectSetup() {
    await this.createProject({ competitionType: "CR&D", profiles: true, projectSource: "IFS" });
  }
}
