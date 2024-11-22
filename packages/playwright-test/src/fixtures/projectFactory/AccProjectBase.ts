import {
  BaseCrndProjectScriptContext,
  BaseCrndProjectScript,
} from "@innovateuk/project-factory-two/scripts/BaseCrndProjectScript";
import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";

export
@Fixture("accProjectBase")
class AccProjectBase extends ProjectFactory<BaseCrndProjectScriptContext> {
  getScript({ connection }: { connection: ITsforceConnection }) {
    return new BaseCrndProjectScript({ connection });
  }

  @Given("a standard CR&D project exists")
  async create() {
    await this.createProject();
  }
}
