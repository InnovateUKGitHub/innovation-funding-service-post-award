import { Fixture, Then, When } from "playwright-bdd/decorators";
import { SfdcLightningPageHeaderDetailBlockComponent } from "../../../components/sfdc/SfdcLightningPageHeaderDetailBlockComponent";
import { ProjectState } from "../../projectFactory/ProjectState";
import { SfdcLightningPage } from "../SfdcLightningPage";
import { SfdcBasePage } from "./SfdcBasePage";
import { SfdcLightningTabBarItemComponent } from "../../../components/sfdc/SfdcLightningTabBarItemComponent";
import { SfdcLightningListViewManagerComponent } from "../../../components/sfdc/SfdcLightningListViewManagerComponent";

export
@Fixture("sfdcIfspaAppAccProjectPage")
class SfdcIfspaAppAccProjectPage extends SfdcBasePage {
  private readonly projectNumberDetail: SfdcLightningPageHeaderDetailBlockComponent;

  constructor({
    sfdcLightningPage,
    projectState,
  }: {
    sfdcLightningPage: SfdcLightningPage;
    projectState: ProjectState;
  }) {
    super({ sfdcLightningPage, projectState });
    this.projectNumberDetail = SfdcLightningPageHeaderDetailBlockComponent.create(sfdcLightningPage, "Project Number");
  }

  public static create(
    { sfdcPage, projectState }: { sfdcPage: SfdcLightningPage; projectState: ProjectState },
    use: (x: SfdcIfspaAppAccProjectPage) => Promise<void>,
  ) {
    use(new SfdcIfspaAppAccProjectPage({ sfdcLightningPage: sfdcPage, projectState }));
  }

  @When("the internal user goes to the {string} tab")
  async gotoTab(tab: string) {
    await SfdcLightningTabBarItemComponent.create(this.sfdcLightningPage, tab).click();
  }

  @Then("the internal user sees {int} result(s) in the {string} box")
  async canSeeReusltsInTab(occurances: number, tab: string) {
    await SfdcLightningListViewManagerComponent.create(this.sfdcLightningPage, tab, occurances).isVisible();
  }

  @Then("the internal user sees over 30 results in the {string} box")
  async canSeeManyReusltsInTab(tab: string) {
    await SfdcLightningListViewManagerComponent.create(this.sfdcLightningPage, tab, "30+").isVisible();
  }

  @Then("the internal user sees the project details")
  canSeeProjectNumber() {
    return this.projectNumberDetail.hasValue(this.projectState.prefixedProjectNumber());
  }

  @Then("the internal user sees the Acc_Project__c flexipage")
  isPage(): Promise<void> {
    return this.canSeeProjectNumber();
  }
}
