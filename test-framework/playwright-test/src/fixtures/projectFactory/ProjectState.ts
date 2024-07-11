import { Fixture } from "playwright-bdd/decorators";

export
@Fixture("projectState")
class ProjectState {
  public prefix: string;
  public project: {
    number: string;
    title: string;
  };

  prefixedProjectNumber() {
    return this.prefix + this.project.number;
  }
}
