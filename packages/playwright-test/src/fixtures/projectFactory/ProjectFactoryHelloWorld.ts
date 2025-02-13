import { Fixture, Given } from "playwright-bdd/decorators";
import { HelloWorldApexScript } from "@innovateuk/project-factory-two/scripts/HelloWorldApexScript";
import { ITsforceConnection } from "@innovateuk/tsforce/index";
import { AbstractProjectFactoryApexScript } from "./AbstractProjectFactoryApexScript";

export
@Fixture("projectFactoryHelloWorld")
class ProjectFactoryHelloWorld extends AbstractProjectFactoryApexScript<{}> {
  getScript({ connection }: { connection: ITsforceConnection }) {
    return new HelloWorldApexScript({ connection });
  }

  @Given("a connection to Salesforce exists")
  async create() {
    await this.createProject({});
  }
}
