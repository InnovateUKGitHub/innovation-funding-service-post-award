import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";
import {
  ProjectWithoutFinanceContactArguments,
  ProjectWithoutFinanceContactContext,
  ProjectWithoutFinanceContactScript,
} from "@innovateuk/project-factory-two/scripts/ProjectWithoutFinanceContact";

export
@Fixture("accProjectWithoutFc")
class AccProjectWithoutFC extends ProjectFactory<
  ProjectWithoutFinanceContactContext,
  ProjectWithoutFinanceContactArguments
> {
  getScript({ connection }: { connection: ITsforceConnection }) {
    return new ProjectWithoutFinanceContactScript({ connection });
  }

  @Given("a project without an FC exists")
  async create() {
    await this.createProject({});
  }
}
