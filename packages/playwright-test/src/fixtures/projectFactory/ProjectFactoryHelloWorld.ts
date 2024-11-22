import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";
import { HelloWorldApexScript } from "@innovateuk/project-factory-two/scripts/HelloWorldApexScript";
import { ITsforceConnection } from "@innovateuk/tsforce/index";

export
@Fixture("projectFactoryHelloWorld")
class ProjectFactoryHelloWorld extends ProjectFactory<unknown> {
  getScript({ connection }: { connection: ITsforceConnection }) {
    return new HelloWorldApexScript({ connection });
  }

  @Given("a connection to Salesforce exists")
  async create() {
    await this.createProject();
  }
}
