import { Locator, Page, Project } from "@playwright/test";
import { Fixture, Then } from "playwright-bdd/decorators";
import { Commands } from "../../Commands";
import { PageHeading } from "../../../components/PageHeading";

export
@Fixture("allanProjectDetails")
class AllanProjectDetails {
  protected readonly page: Page;
  protected readonly commands: Commands;
  private readonly prefix: string;
  private readonly goBack: Locator;
  private readonly dashboardTitle: PageHeading;
  private readonly subHeading: Locator;
  private readonly dateTitle: Locator;
  private readonly membersHeading: Locator;
  private readonly moHeading: Locator;
  private readonly moDetails: Array<[string, string]>;
  private readonly pmHeading: Locator;
  private readonly pmGuidance: Locator;
  private readonly pmDetails: Array<[string, string]>;
  private readonly fcHeading: Locator;
  private readonly fcGuidance: Locator;
  private readonly fcDetails: Array<[string, string]>;
  private readonly changeGuidance: Locator;
  private readonly grantsEmail: Locator;
  private readonly otherContactsHeading: Locator;
  private readonly otherContactsGuidance: Locator;
  private readonly partnerInfoHeading: Locator;
  private readonly partnerInfoDetails: Array<[string, string]>;
  private readonly projectInfoHeading: Locator;
  private readonly projectInfoDetails: Array<[string, string, string]>;

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;
    this.prefix = `${this.prefixGen()}`;
    this.goBack = this.commands.backLink("back to Project");
    this.dashboardTitle = PageHeading.fromTitle(page, "Project details");
    this.subHeading = this.page.getByRole("heading").filter({ hasText: `Project period ${/[0-12]/} of ${/[12-48]/}` });
    this.dateTitle = this.page.getByTestId("section-subtitle").filter({ hasText: `${this.projectDuration()}` });
    this.membersHeading = this.page.getByRole("heading").filter({ hasText: "Project members" });
    this.moHeading = this.page.getByRole("heading").filter({ hasText: "Monitoring officer" });
    this.moDetails = [
      ["Name", "Matt Otrebski"],
      ["Email", `${this.prefix}.mo@x.gov.uk`],
    ];
    this.pmHeading = this.page.getByRole("heading").filter({ hasText: "Project manager" });
    this.pmGuidance = this.page
      .getByRole("paragraph")
      .filter({ hasText: "Only project managers can raise project change requests." });
    this.pmDetails = [
      ["Name", "Peter May"],
      ["Email", `${this.prefix}.pm.gov.uk`],
    ];
    this.fcHeading = this.page.getByRole("heading").filter({ hasText: "Finance contact" });
    this.fcGuidance = this.page.getByRole("paragraph").filter({ hasText: "Only finance contacts can submit claims." });
    this.fcDetails = [
      ["Name", "Ferris Colton"],
      ["Partner", "Hedge's Consulting Ltd. (Lead)"],
      ["Email", `${this.prefix}.fc@x.gov.uk`],
    ];
    this.changeGuidance = this.page
      .getByRole("paragraph")
      .filter({ hasText: "If you need to change the lead project manager or finance contact, please email " });
    this.grantsEmail = this.page.getByRole("link").filter({ hasText: "grants_service@iuk.ukri.org" });
    this.otherContactsHeading = this.page.getByRole("heading").filter({ hasText: "Other contacts" });
    this.otherContactsGuidance = this.page.getByRole("paragraph").filter({ hasText: "No contacts exist." });
    this.partnerInfoHeading = this.page.getByRole("heading").filter({ hasText: "Partner information" });
    this.partnerInfoDetails = [
      ["Name", "Hedge's Consulting Ltd. (Lead)"],
      ["Partner type", "Business"],
      ["Status", "Active"],
      ["Funding status", "Funded"],
      ["Location", ""],
    ];
    this.projectInfoHeading = this.page.getByRole("heading").filter({ hasText: "Project information" });
    this.projectInfoDetails = [
      ["competition-name", "Competition name", String(/^[a-zA-Z0-9]+$/)],
      ["competition-type", "Competition type", "CR&D"],
      ["start-date", "Project start date", `1 ${this.startDate()}`],
      ["end-date", "Project end date", `${this.endDate()}`],
      ["duration", "Duration", "36"],
      ["periods", "Number of periods", "12"],
      ["scope", "Project scope statement", ""],
    ];
  }

  @Then("Project details will be displayed with correct information")
  async projectDetailsPage() {
    await this.goBack.isVisible();
    await this.dashboardTitle.isVisible();
    await this.subHeading.isVisible();
    await this.dateTitle.isVisible();
    await this.membersHeading.isVisible();
    await this.moHeading.isVisible();
    await this.checkTableDetails("monitoring-officer-details", this.moDetails);
    await this.pmHeading.isVisible();
    await this.pmGuidance.isVisible();
    await this.checkTableDetails("project-manager-details", this.pmDetails);
    await this.fcHeading.isVisible();
    await this.fcGuidance.isVisible();
    await this.checkTableDetails("finance-contact-details", this.fcDetails);
    await this.changeGuidance.isVisible();
    await this.grantsEmail.isVisible();
    await this.otherContactsHeading.isVisible();
    await this.otherContactsGuidance.isVisible();
    await this.partnerInfoHeading.isVisible();
    await this.checkTableDetails("partner-information", this.partnerInfoDetails);
    await this.projectInfoHeading.isVisible();
    await this.checkDataList();
  }

  /**
   * METHODS
   */

  async prefixGen() {
    let prefix = Math.floor(Date.now() / 1000);
    return String(prefix);
  }

  async projectDuration() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `1 ${month} to ${day + 30} ${month + 12} ${year}`;
  }

  async startDate() {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `1 ${month} ${year}`;
  }

  async endDate() {
    const date = new Date();
    const month = date.getMonth() + 36;
    const year = date.getFullYear() + 3;

    return `31 ${month} ${year}`;
  }

  async checkTableDetails(qaTag: string, tableData: Array<[string, string]>) {
    let i: number = 0;
    for (const [heading, data] of tableData) {
      await this.page.getByTestId(qaTag).locator("css=th").nth(i).filter({ hasText: heading }).isVisible();
      await this.page.getByTestId(qaTag).locator("css=td").nth(i).filter({ hasText: data }).isVisible();
      i++;
    }
  }

  async checkDataList() {
    for (const [qa, key, data] of this.projectInfoDetails) {
      await this.page.getByTestId(qa).locator("css=dt").filter({ hasText: key }).isVisible();
      await this.page.getByTestId(qa).locator("css=dd").nth(1).filter({ hasText: data }).isVisible();
    }
  }
}
