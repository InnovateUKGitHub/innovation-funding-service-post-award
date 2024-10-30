import { Fixture, Given, Then } from "playwright-bdd/decorators";
import { SfdcBasePage } from "./SfdcBasePage";
import { SfdcLightningPage } from "../SfdcLightningPage";
import { SfdcLightningFlexipageComponent } from "../../../components/sfdc/SfdcLightningFlexipageComponent";
import { ProjectState } from "../../projectFactory/ProjectState";

export
@Fixture("sfdcIfspaAppDashboard")
class SfdcIfspaAppDashboard extends SfdcBasePage {
  public static create(
    { sfdcPage, projectState }: { sfdcPage: SfdcLightningPage; projectState: ProjectState },
    use: (x: SfdcIfspaAppDashboard) => Promise<void>,
  ) {
    use(new SfdcIfspaAppDashboard({ sfdcLightningPage: sfdcPage, projectState }));
  }

  @Then("the internal user sees the IFS Post Award app homepage")
  async isPage() {
    await this.userSeesLightningFexipageComponent("Projects by Status");
    await this.userSeesLightningFexipageComponent("Items to Approve");
    await this.userSeesLightningFexipageComponent("Today’s Tasks");
    await this.userSeesLightningFexipageComponent("Flagged Projects");
    await this.userSeesLightningFexipageComponent("Recent Records");
  }

  @Then("the internal user sees the {string} card")
  async userSeesLightningFexipageComponent(cardName: string) {
    await SfdcLightningFlexipageComponent.fromHeader(this.sfdcLightningPage.page, cardName).isVisible();
  }

  @Then("the internal user sees the {string} context bar item")
  async userSeesLightningContextBarItemComponent(tabName: string) {
    await SfdcLightningFlexipageComponent.fromHeader(this.sfdcLightningPage.page, tabName).isVisible();
  }
}
