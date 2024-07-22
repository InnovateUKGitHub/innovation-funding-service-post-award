import { Fixture, Given } from "playwright-bdd/decorators";

export
@Fixture("projectState")
class ProjectState {
  public prefix: string = "";

  public project: {
    number: string;
    title: string;
  } = {
    number: "",
    title: "",
  };

  public usernames: string[] = [];

  prefixedProjectNumber() {
    return this.prefix + this.project.number;
  }

  @Given("the project number is {string}")
  public setProjectNumber(number: string) {
    this.project.number = number;
  }
}
