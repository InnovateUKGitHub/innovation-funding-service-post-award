import { expect, Locator, Page, Project } from "@playwright/test";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../Commands";
import { PageHeading } from "../../../components/PageHeading";
import { getLorem } from "../../../components/lorem";

export
@Fixture("projectDetails")
class ProjectDetails {
  protected readonly page: Page;
  protected readonly commands: Commands;
  private readonly goBack: Locator;
  private readonly dashboardTitle: PageHeading;
  private readonly subHeading: Locator;
  private readonly dateTitle: Locator;
  private readonly membersHeading: Locator;
  private readonly moHeading: Locator;
  private readonly moEmail: string;
  private readonly moDetails: Array<[string, string]>;
  private readonly pmHeading: Locator;
  private readonly pmGuidance: Locator;
  private readonly pmEmail: string;
  private readonly pmDetails: Array<[string, string]>;
  private readonly fcHeading: Locator;
  private readonly fcGuidance: Locator;
  private readonly fc1Email: string;
  private readonly fcDetails: Array<[string, string]>;
  private readonly fc2Email: string;
  private readonly fc2Details: Array<[string, string]>;
  private readonly changeGuidance: Locator;
  private readonly grantsEmail: Locator;
  private readonly otherContactsHeading: Locator;
  private readonly otherContactsGuidance: Locator;
  private readonly partnerInfoHeading: Locator;
  private readonly partnerInfoDetailsPmMO: Array<[string, string]>;
  private readonly partnerInfoDetailsFc: Array<[string, string]>;
  private readonly partner2InfoDetailsPmMo: Array<[string, string]>;
  private readonly partner2InfoDetailsFc: Array<[string, string]>;
  private readonly partnerInfoDetailsUpdatedFc: Array<[string, string]>;
  private readonly partnerInfoDetailsUpdatedPm: Array<[string, string]>;
  private readonly projectInfoHeading: Locator;
  private readonly projectInfoDetails: Array<[string, string, string | RegExp]>;
  private readonly projectInfoList: Array<[string, string, string]>;
  private readonly updateLocationPage: Array<string>;
  private readonly locationPageHint: Locator;
  private readonly newPostcode: string;
  private readonly updateLocationButton: Locator;
  private readonly projectDetailsBacklink: Locator;
  private readonly postCodeValMsg: Locator;

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;
    this.goBack = this.commands.backLink("back to Project");
    this.dashboardTitle = PageHeading.fromTitle(page, "Project details");
    this.subHeading = this.page.getByRole("heading").filter({ hasText: `Project period 1 of 12` });
    this.dateTitle = this.page.getByTestId("section-subtitle");
    this.membersHeading = this.page.getByRole("heading").filter({ hasText: "Project members" });
    this.moHeading = this.page.getByRole("heading").filter({ hasText: "Monitoring officer" });
    this.moEmail = ".mo@x.gov.uk";
    this.moDetails = [
      ["Name", "Monitoring Officer"],
      ["Email", this.moEmail],
    ];
    this.pmHeading = this.page.getByRole("heading").filter({ hasText: "Project manager" });
    this.pmGuidance = this.page
      .getByRole("paragraph")
      .filter({ hasText: "Only project managers can raise project change requests." });
    this.pmEmail = ".pm@x.gov.uk";
    this.pmDetails = [
      ["Name", "Project Manager"],
      ["Partner", "Hedge's Primary Ltd."],
      ["Email", this.pmEmail],
    ];
    this.fcHeading = this.page.getByRole("heading").filter({ hasText: "Finance contact" });
    this.fcGuidance = this.page.getByRole("paragraph").filter({ hasText: "Only finance contacts can submit claims." });
    this.fc1Email = "fc1@x.gov.uk";
    this.fcDetails = [
      ["Name", "Main Finance Contact"],
      ["Partner", "Hedge's Primary Ltd. (Lead)"],
      ["Email", this.fc1Email],
    ];
    this.fc2Email = "fc2@x.gov.uk";
    this.fc2Details = [
      ["Name", "Secondary Finance Contact"],
      ["Partner", "Hedge's Secondary Ltd."],
      ["Email", this.fc2Email],
    ];
    this.changeGuidance = this.page
      .getByRole("paragraph")
      .filter({ hasText: "If you need to change the lead project manager or finance contact, please email " });
    this.grantsEmail = this.page.getByRole("link").filter({ hasText: "grants_service@iuk.ukri.org" });
    this.otherContactsHeading = this.page.getByRole("heading").filter({ hasText: "Other contacts" });
    this.otherContactsGuidance = this.page.getByRole("paragraph").filter({ hasText: "No contacts exist." });
    this.partnerInfoHeading = this.page.getByRole("heading").filter({ hasText: "Partner information" });
    this.partnerInfoDetailsPmMO = [
      ["Name", "Hedge's Primary Ltd. (Lead)"],
      ["Partner type", "Business"],
      ["Status", "Active"],
      ["Funding status", "Funded"],
      ["Location", ""],
    ];
    this.partnerInfoDetailsFc = [
      ["Name", "Hedge's Primary Ltd. (Lead)"],
      ["Partner type", "Business"],
      ["Location", ""],
    ];
    this.partner2InfoDetailsPmMo = [
      ["Name", "Hedge's Secondary Ltd."],
      ["Partner type", "Business"],
      ["Status", "Active"],
      ["Funding status", "Funded"],
      ["Location", ""],
    ];
    this.partner2InfoDetailsFc = [
      ["Name", "Hedge's Secondary Ltd."],
      ["Partner type", "Business"],
      ["Location", ""],
    ];
    this.partnerInfoDetailsUpdatedFc = [
      ["Name", "Hedge's Primary Ltd. (Lead)"],
      ["Partner type", "Business"],
      ["Location", "SN2 1LT"],
    ];
    this.partnerInfoDetailsUpdatedPm = [
      ["Name", "Hedge's Primary Ltd. (Lead)"],
      ["Partner type", "Business"],
      ["Status", "Active"],
      ["Funding status", "Funded"],
      ["Location", "SN2 1LT"],
    ];
    this.projectInfoHeading = this.page.getByRole("heading").filter({ hasText: "Project information" });
    this.projectInfoDetails = [
      ["competition-name", "Competition name", /^[a-zA-Z0-9]+$/],
      ["competition-type", "Competition type", "CR&D"],
      ["end-date", "Project end date", `2027`],
      ["duration", "Duration", "36"],
      ["periods", "Number of periods", "12"],
      ["scope", "Project scope statement", "This is a project summary"],
    ];
    this.projectInfoList = [
      ["Name", "Hedge's Primary Ltd.", "partner-name"],
      ["Type", "Business", "partner-type"],
      ["Location", "Edit", "partner-postcode"],
    ];
    this.updateLocationPage = ["Current location", "New location"];
    this.locationPageHint = this.page.getByText("Enter the postcode.");
    this.updateLocationButton = this.page
      .getByRole("button")
      .filter({ hasText: "Save and return to partner information" });
    this.newPostcode = "SN2 1LT";
    this.projectDetailsBacklink = this.commands.backLink("Back to project details");
    this.postCodeValMsg = this.page
      .getByTestId("validation-summary")
      .filter({ hasText: "Project location postcode must be 10 characters or less." });
  }

  @Then("Project details will be displayed with correct information for {string}")
  async projectDetailsPage(user: string) {
    const daterange = this.projectDuration();
    await expect(this.goBack).toBeVisible();
    await expect(this.dashboardTitle.get()).toBeVisible();
    await expect(this.subHeading).toBeVisible();
    await expect(this.dateTitle.filter({ hasText: daterange })).toBeVisible();
    await expect(this.membersHeading).toBeVisible();
    await expect(this.moHeading).toBeVisible();
    await this.checkTableDetails("monitoring-officer-details", 1, this.moDetails);
    await expect(this.pmHeading).toBeVisible();
    await expect(this.pmGuidance).toBeVisible();
    await this.checkTableDetails("project-manager-details", 1, this.pmDetails);
    await expect(this.fcHeading).toBeVisible();
    await expect(this.fcGuidance).toBeVisible();
    await this.checkTableDetails("finance-contact-details", 1, this.fcDetails);

    await this.checkTableDetails("finance-contact-details", 2, this.fc2Details);

    await expect(this.changeGuidance).toBeVisible();
    await expect(this.grantsEmail).toBeVisible();
    await expect(this.otherContactsHeading).toBeVisible();
    await expect(this.otherContactsGuidance).toBeVisible();
    await expect(this.partnerInfoHeading).toBeVisible();
    if (user === "Finance Contact") {
      await this.checkTableDetails("partner-information", 1, this.partnerInfoDetailsFc);
      await this.checkTableDetails("partner-information", 2, this.partner2InfoDetailsFc);
    } else if (user === "Project Manager") {
      await this.checkTableDetails("partner-information", 1, this.partnerInfoDetailsPmMO);
      await this.checkTableDetails("partner-information", 2, this.partner2InfoDetailsPmMo);
    }
    await expect(this.projectInfoHeading).toBeVisible();
    await this.checkDataList();
  }

  @Given("the user can see the project details heading")
  async isPage() {
    await expect(this.dashboardTitle.get()).toBeVisible();
  }

  @When("the user clicks on the {string} partner name")
  async clickPartnerName(name: string) {
    await this.page.getByRole("link").filter({ hasText: name }).click();
  }

  @Then("the partner information page is displayed")
  async partnerInfo() {
    for (const [key, item, qa] of this.projectInfoList) {
      await this.commands.getListItemFromKey(key, item, 1, false, qa);
    }
  }

  @When("the user clicks the Edit button next to location")
  async clickEdit() {
    this.page.getByRole("link").filter({ hasText: "Edit" }).click();
  }

  @Then("the user can update the project location")
  async updateLocation() {
    let i = 1;
    for (const label of this.updateLocationPage) {
      await expect(this.page.locator(`//fieldset/div[${i}]//label`)).toBeVisible();
      i++;
    }
    await expect(this.locationPageHint).toBeVisible();
    await expect(this.partnerInfoHeading).toBeVisible();
    await this.page.getByRole("textbox").fill(this.newPostcode);
  }

  @When("the user returns to project details")
  async saveUpdatedInfo() {
    await this.updateLocationButton.click();
  }

  @Then("the new location is displayed on Partner information page")
  async projectInformationLocation() {
    await this.commands.getListItemFromKey("Location", this.newPostcode, 1);
  }

  @When("the user navigates back to Project details")
  async backToProjectDetails() {
    await this.projectDetailsBacklink.click();
  }

  @Then("the new location is displayed on Project details page")
  async projectDetailsLocation() {
    await this.checkTableDetails("partner-information", 1, this.partnerInfoDetailsUpdatedFc);
  }

  @When("the user exceeds 10 characters in the postcode field")
  async exceedCharacters() {
    await this.commands.textValidation(
      "Project location postcode",
      10,
      "Save and return to partner information",
      false,
      false,
      "New location",
    );
    await this.page.getByRole("textbox").fill(getLorem(11));
  }

  @Then("the postcode character limit is validated")
  async postCodeValidation() {
    await expect(this.postCodeValMsg).toBeVisible();
  }

  /**
   * METHODS
   */
  async emailGen(suffix: string) {
    let prefix = String(Math.floor(Date.now() / 1000));
    let email = `${prefix}${suffix}`;
    console.log(email);
    return email;
  }

  projectDuration() {
    let start = new Date().toLocaleString("en-GB", { month: "short" });
    let projectduration = `1 ${start} `;
    return projectduration;
  }

  startDate() {
    const start = new Date().toLocaleString("en-GB", { month: "long", year: "numeric" });
    return `1 ${start}`;
  }

  endDate() {
    const date = new Date();
    const month = date.getMonth() + 36;
    const year = date.getFullYear() + 3;

    return `31 ${month} ${year}`;
  }

  async checkTableDetails(qaTag: string, rowNumber: number, tableData: Array<[string, string]>) {
    let i: number = 0;
    for (const [heading, data] of tableData) {
      await expect(this.page.getByTestId(qaTag).locator("css=th").nth(i).filter({ hasText: heading })).toBeVisible();
      await expect(
        this.page
          .getByTestId(qaTag)
          .locator("tr")
          .nth(rowNumber)
          .filter({ has: this.page.locator("css=td").nth(i).filter({ hasText: data }) }),
      ).toBeVisible();
      i++;
    }
  }

  async checkDataList() {
    for (const [qa, key, data] of this.projectInfoDetails) {
      await expect(this.page.getByTestId(qa).locator("css=dt").filter({ hasText: key })).toBeVisible();
      await expect(this.page.getByTestId(qa).locator("css=dd").nth(0).filter({ hasText: data })).toBeVisible();
    }
    let startdate = this.startDate();
    await expect(
      this.page.getByTestId("start-date").locator("css=dt").filter({ hasText: "Project start date" }),
    ).toBeVisible();
    await expect(
      this.page
        .getByTestId("start-date")
        .locator("css=dd")
        .nth(0)
        .filter({ hasText: String(startdate) }),
    ).toBeVisible();
  }
}
