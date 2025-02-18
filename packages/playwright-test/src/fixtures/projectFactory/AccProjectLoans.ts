import {
  LoansProjectFactoryScript,
  LoansProjectFactoryScriptArguments,
  LoansProjectFactoryScriptContext,
} from "@innovateuk/project-factory-two/scripts/LoansProjectFactoryScript";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";
import { ITsforceConnection } from "@innovateuk/tsforce/index";

export
@Fixture("accProjectLoans")
class AccProjectLoans extends ProjectFactory<LoansProjectFactoryScriptContext, LoansProjectFactoryScriptArguments> {
  getScript({ connection }: { connection: ITsforceConnection }) {
    return new LoansProjectFactoryScript({ connection });
  }
  @Given("a standard Loans project exists")
  async loansProject() {
    await this.createProject({ generateProfiles: true, competitionType: "LOANS" });
  }
}
