import { EnvironmentManager } from "@innovateuk/environment-manager";
import { Fixture } from "playwright-bdd/decorators";

export
@Fixture("environment")
class Environment {
  public readonly envman: EnvironmentManager;

  constructor() {
    this.envman = new EnvironmentManager(process.env.TEST_SALESFORCE_SANDBOX);
  }
}
