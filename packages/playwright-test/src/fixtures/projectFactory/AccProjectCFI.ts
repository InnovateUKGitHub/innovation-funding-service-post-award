import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";
import {
  TwoParticipantCFIProjectFactoryScript,
  TwoParticipantCFIProjectFactoryScriptArguments,
  TwoParticipantCFIProjectFactoryScriptContext,
} from "@innovateuk/project-factory-two/scripts/TwoParticipantContractsForInnovation";
import { ITsforceConnection } from "@innovateuk/tsforce/index";

export
@Fixture("accProjectCFI")
class AccProjectCFI extends ProjectFactory<
  TwoParticipantCFIProjectFactoryScriptContext,
  TwoParticipantCFIProjectFactoryScriptArguments
> {
  getScript({ connection }: { connection: ITsforceConnection }) {
    return new TwoParticipantCFIProjectFactoryScript({ connection });
  }

  @Given("a multi-partner Contracts for Innovation project exists")
  async cfiMultiProject() {
    await this.createProject({ competitionType: "Contracts for Innovation", profiles: true });
  }
}
