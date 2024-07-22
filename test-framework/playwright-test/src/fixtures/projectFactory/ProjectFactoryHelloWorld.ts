import { Fixture, Given } from "playwright-bdd/decorators";
import { ProjectFactory } from "./ProjectFactory";

export
@Fixture("projectFactoryHelloWorld")
class ProjectFactoryHelloWorld extends ProjectFactory {
  getProject(): never {
    throw new Error("not implemented");
  }

  @Given("a connection to Salesforce exists")
  async create() {
    await this.sfdcApi.runApex("System.debug('Hello world!');");
  }
}
