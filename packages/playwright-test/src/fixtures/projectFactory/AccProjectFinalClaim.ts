import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";
import {
  TwoParticipantProjectFactoryFinalClaimArguments,
  TwoParticipantProjectFactoryFinalClaimContext,
  TwoParticipantProjectFactoryFinalClaimScript,
} from "@innovateuk/project-factory-two/scripts/TwoParticipantProjectFactoryFinalClaim";

export
@Fixture("accProjectFinalClaim")
class AccProjectFinalClaim extends ProjectFactory<
  TwoParticipantProjectFactoryFinalClaimContext,
  TwoParticipantProjectFactoryFinalClaimArguments
> {
  getScript({ connection }: { connection: ITsforceConnection }) {
    return new TwoParticipantProjectFactoryFinalClaimScript({ connection });
  }

  @Given("a multi-partner CR&D project in Final Claim exists")
  async crndMultiProject() {
    await this.createProject({ profiles: true, competitionType: "CR&D" });
  }

  @Given("a multi-partner SBRI project in Final Claim exists")
  async sbriMultiProject() {
    await this.createProject({ profiles: true, competitionType: "SBRI" });
  }
}
