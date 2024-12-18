import { CypressDoNotTouchProjectFactoryScript } from "@innovateuk/project-factory-two/scripts/CypressDoNotTouchProjectFactoryScript";
import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";

export
@Fixture("acc1CypressDoNotTouch")
class Acc1CypressDoNotTouch extends ProjectFactory<{}, {}> {
  getScript({ connection }: { connection: ITsforceConnection }) {
    return new CypressDoNotTouchProjectFactoryScript({ connection });
  }

  @Given("the Cypress DO NOT TOUCH project exists")
  async create() {
    await this.createProject({});
  }
}
