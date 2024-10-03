import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Then } from "playwright-bdd/decorators";
import { PageHeading } from "../../../components/PageHeading";

export
@Fixture("projectDetails")
class ProjectDetails {
  protected readonly page: Page;
  protected readonly pageTitle: PageHeading;
  private readonly heading: Locator;
  private readonly dateValueTestId: Locator;
  private readonly dateValueXPath: Locator;
  private readonly dateValueText: Locator;
  private readonly dateValueCss: Locator;
  private readonly dateValueString: string;
  private readonly dateVal: string;
  private readonly projectPeriod1to12: Locator;
  private readonly projectMembersTitle: Locator;
  private readonly monitoringOfficerTitle: Locator;
  private readonly monitoringOfficerName: Locator;
  private readonly monitoringOfficerEmail: Locator;
  private readonly projectManagerTitle: Locator;
  private readonly projectManagerName: Locator;
  private readonly projectManagerEmail: Locator;
  private readonly projectManagerPartner: Locator;
  private readonly financeContactTitle: Locator;
  private readonly financeContactName: Locator;
  private readonly financeContactEmail: Locator;
  private readonly financeContactPartner: Locator;
  private readonly partnerInformationTitle: Locator;
  private readonly partnerInformationName: Locator;
  private readonly partnerInformationType: Locator;
  private readonly partnerInformationStatus: Locator;
  private readonly partnerInformationFundingStatus: Locator;
  private readonly projectInformationTitle: Locator;
  private readonly projectInformationName: Locator;
  private readonly projectInformationCompType: Locator;
  private readonly projectInformationStartDate: Locator;
  private readonly projectInformationEndDate: Locator;
  private readonly projectInformationDuration: Locator;
  private readonly projectInformationNoOfPeriods: Locator;
  private readonly projectInformationStartDateVal: String;
  private readonly projectInformationEndDateVal: String;

  constructor({ page }: { page: Page }) {
    this.page = page;
    this.pageTitle = PageHeading.fromTitle(page, "Project details");
    this.heading = this.page.getByRole("heading");

    // Project period start and end date
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 0);
    startDate.setDate(0);

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3);
    endDate.setDate(0);
    endDate.setDate(endDate.getDate() - 1);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    this.dateVal =
      startDate.getDate().toString() +
      " " +
      monthNames[startDate.getMonth()] +
      " to " +
      endDate.getDate().toString() +
      " " +
      monthNames[endDate.getMonth()] +
      " " +
      endDate.getFullYear().toString();

    // Partner information start and end date
    const startDatePI = new Date();
    const endDatePI = new Date();
    startDatePI.setMonth(startDatePI.getMonth() - 0);
    startDatePI.setDate(0);

    const monthNamesPI = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    this.projectInformationStartDateVal =
      startDatePI.getDate().toString() +
      " " +
      monthNamesPI[startDatePI.getMonth()] +
      " " +
      startDatePI.getFullYear().toString();

    endDatePI.setMonth(endDatePI.getMonth() + 36);
    endDatePI.setDate(0);

    this.projectInformationEndDateVal =
      endDatePI.getDate().toString() +
      " " +
      monthNamesPI[endDatePI.getMonth()] +
      " " +
      endDatePI.getFullYear().toString();

    // Project Period Date
    this.dateValueTestId = this.page.getByTestId("section-subtitle");
    this.dateValueXPath = this.page.locator("//p[@data-qa='section-subtitle']");
    this.dateValueText = this.page.getByText(this.dateVal);
    this.dateValueCss = this.page.locator("css=span");

    this.projectPeriod1to12 = this.page.locator("//div[@data-qa='period-information']/div/h2");
    this.projectMembersTitle = this.page.getByText("Project members");

    // MO
    this.monitoringOfficerTitle = this.page.locator(
      "//div[@class][1]/div[@class='govuk-grid-column-full govuk-!-margin-bottom-5']/h3",
    );
    this.monitoringOfficerName = this.page.locator("//div[@data-qa='monitoring-officer-details']//tbody/tr/td[1]");
    this.monitoringOfficerEmail = this.page.locator("//div[@data-qa='monitoring-officer-details']//tbody/tr/td[2]");

    // PM
    this.projectManagerTitle = this.page.locator(
      "//div[@class][2]/div[@class='govuk-grid-column-full govuk-!-margin-bottom-5']/h3",
    );
    this.projectManagerName = this.page.locator("//div[@data-qa='project-manager-details']//tbody/tr[1]/td[1]");
    this.projectManagerPartner = this.page.locator("//div[@data-qa='project-manager-details']//tbody/tr[1]/td[2]");
    this.projectManagerEmail = this.page.locator("//div[@data-qa='project-manager-details']//tbody/tr[1]/td[3]");

    // FC
    this.financeContactTitle = this.page.locator(
      "//div[@class][3]/div[@class='govuk-grid-column-full govuk-!-margin-bottom-5']/h3",
    );
    this.financeContactName = this.page.locator("//div[@data-qa='finance-contact-details']//tbody/tr[1]/td[1]");
    this.financeContactPartner = this.page.locator("//div[@data-qa='finance-contact-details']//tbody/tr[1]/td[2]");
    this.financeContactEmail = this.page.locator("//div[@data-qa='finance-contact-details']//tbody/tr[1]/td[3]");

    // Partner Information
    this.partnerInformationTitle = this.page.locator(
      "//div[@class='govuk-grid-row acc-section govuk-!-margin-bottom-6'][3]/div/h2[@class='govuk-heading-l govuk-!-margin-bottom-0']",
    );
    this.partnerInformationName = this.page.locator("//div[@data-qa='partner-information']//tbody/tr[1]/td[1]");
    this.partnerInformationType = this.page.locator("//div[@data-qa='partner-information']//tbody/tr[1]/td[2]");
    this.partnerInformationStatus = this.page.locator("//div[@data-qa='partner-information']//tbody/tr[1]/td[3]");
    this.partnerInformationFundingStatus = this.page.locator(
      "//div[@data-qa='partner-information']//tbody/tr[1]/td[4]",
    );

    //Project Information
    this.projectInformationTitle = this.page.locator(
      "//div[@class='govuk-grid-row acc-section govuk-!-margin-bottom-6'][4]/div/h2[@class='govuk-heading-l govuk-!-margin-bottom-0']",
    );
    this.projectInformationName = this.page.locator("//dt[text()='Competition name']/ancestor::div/dd/p");
    this.projectInformationCompType = this.page.locator("//dt[text()='Competition type']/ancestor::div/dd/p");
    this.projectInformationStartDate = this.page.locator("//dt[text()='Project start date']/ancestor::div/dd/span");
    this.projectInformationEndDate = this.page.locator("//dt[text()='Project end date']/ancestor::div/dd/span");
    this.projectInformationDuration = this.page.locator("//dt[text()='Duration']/ancestor::div/dd[1]");
    this.projectInformationNoOfPeriods = this.page.locator("//dt[text()='Number of periods']/ancestor::div/dd[1]");
  }

  @Then("the project details page is displayed")
  async projectDetailsPage() {
    // Check date value
    await expect(this.pageTitle.get()).toBeVisible();
    await expect(this.dateValueTestId).toHaveText(this.dateVal);
    await expect(this.dateValueTestId).toHaveText(this.dateVal);
    await expect(this.dateValueText).toHaveText(this.dateVal);
    await expect(this.dateValueXPath).toHaveText(this.dateVal);

    await expect(this.projectPeriod1to12).toHaveText("Project period 1 of 12");
    await expect(this.projectMembersTitle).toHaveText("Project members");

    //MO
    await expect(this.monitoringOfficerTitle).toHaveText("Monitoring Officer");
    await expect(this.monitoringOfficerName).toHaveText("Matt Otrebski");
    await expect(this.monitoringOfficerEmail).toHaveText(/[0-9].{10}mo@x.gov.uk/);

    //PM
    await expect(this.projectManagerTitle).toHaveText("Project Manager");
    await expect(this.projectManagerName).toHaveText("Peter May");
    await expect(this.projectManagerPartner).toHaveText("Hedge's Consulting Ltd. (Lead)");
    await expect(this.projectManagerEmail).toHaveText(/[0-9].{10}pm@x.gov.uk/);

    //FC
    await expect(this.financeContactTitle).toHaveText("Finance contact");
    await expect(this.financeContactName).toHaveText("Ferris Colton");
    await expect(this.financeContactPartner).toHaveText("Hedge's Consulting Ltd. (Lead)");
    await expect(this.financeContactEmail).toHaveText(/[0-9].{10}fc@x.gov.uk/);

    //Partner information
    await expect(this.partnerInformationTitle).toHaveText("Partner information");
    await expect(this.partnerInformationName).toHaveText("Hedge's Consulting Ltd. (Lead)");
    await expect(this.partnerInformationType).toHaveText("Business");
    await expect(this.partnerInformationStatus).toHaveText("Active");
    await expect(this.partnerInformationFundingStatus).toHaveText("Funded");

    //Project Information
    await expect(this.projectInformationTitle).toHaveText("Project information");
    await expect(this.projectInformationName).toHaveText(/.{15}/);
    await expect(this.projectInformationCompType).toHaveText("CR&D");
    await expect(this.projectInformationStartDate).toHaveText(this.projectInformationStartDateVal);
    await expect(this.projectInformationEndDate).toHaveText(this.projectInformationEndDateVal);
    await expect(this.projectInformationDuration).toHaveText("36 months");
    await expect(this.projectInformationNoOfPeriods).toHaveText("12");
  }

  @Then("Steve ver2")
  async SteveVer2() {}
  steveVer2;
}
