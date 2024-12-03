import {
  TwoParticipantProjectFactoryScript,
  TwoParticipantProjectFactoryScriptArguments,
  TwoParticipantProjectFactoryScriptContext,
} from "@innovateuk/project-factory-two/scripts/TwoParticipantProjectFactoryScript";
import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";

export
@Fixture("accProjectMulti")
class AccProjectMulti extends ProjectFactory<
  TwoParticipantProjectFactoryScriptContext,
  TwoParticipantProjectFactoryScriptArguments
> {
  uatUsers = {
    msp: "van.vicks2023+13@gmail.com",
    pm: "van.vicks2023+14@gmail.com",
    mainFc: "van.vicks2023+15@gmail.com",
    secondaryFc: "van.vicks2023+2@gmail.com",
  };

  getScript({ connection }: { connection: ITsforceConnection }) {
    return new TwoParticipantProjectFactoryScript({ connection });
  }

  @Given("a multi-partner CR&D project exists")
  async crndMultiProject() {
    await this.createProject({ profiles: false, competitionType: "CR&D", usernames: this.uatUsers });
  }

  @Given("a multi-partner SBRI project exists")
  async sbriMultiProject() {
    await this.createProject({ profiles: false, competitionType: "SBRI" });
  }

  @Given("a multi-partner CR&D project with profiles exists")
  async crndMultiProjectWithProfiles() {
    await this.createProject({ profiles: true, competitionType: "CR&D" });
  }

  @Given("a multi-partner SBRI project with profiles exists")
  async sbriMultiProjectWithProfiles() {
    await this.createProject({ profiles: true, competitionType: "SBRI" });
  }
}
