import {
  TwoParticipantProjectFactoryScript,
  TwoParticipantProjectFactoryScriptContext,
} from "@innovateuk/project-factory-two/scripts/TwoParticipantProjectFactoryScript";
import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";

export
@Fixture("accProjectMulti")
class AccProjectMulti extends ProjectFactory<TwoParticipantProjectFactoryScriptContext> {
  getScript({ connection }: { connection: ITsforceConnection }) {
    return new TwoParticipantProjectFactoryScript({ connection });
  }

  @Given("a multi-partner CR&D project exists")
  async multiProject() {
    await this.createProject();
  }
}
