import { expect, Locator, Page } from "@playwright/test";
import { Fixture, Given, Then, When } from "playwright-bdd/decorators";
import { Commands } from "../../Commands";
import { Validators } from "../../validators";
import { AccUserSwitcher } from "../AccUserSwitcher";
import { AccNavigation } from "../AccNavigation";

export
@Fixture("projectDocuments")
class ProjectDocuments {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly validators: Validators;
  protected readonly accNavigation: AccNavigation;
  private readonly pmGuidance: Array<string>;
  private readonly moGuidanceCopy: Array<string>;
  private readonly filesUploadedSubheading: Locator;
  private readonly sharedWithMoSubheading: Locator;
  private readonly sharedWithPrimarySubheading: Locator;
  private readonly sharedWithPartnerSubheading: Locator;
  private readonly uploadedGuidance: Locator;
  private readonly partnerUploadGuidance: Locator;
  private readonly dropDown: Locator;
  private readonly dropDownOptions: Array<string>;
  private readonly accessControl: Locator;
  private readonly accessControlOptions: Array<string>;
  private readonly partnerDocTableHeaders: Array<[string, string]>;

  constructor({
    page,
    commands,
    validators,
    accNavigation,
  }: {
    page: Page;
    commands: Commands;
    validators: Validators;
    accNavigation: AccNavigation;
  }) {
    this.page = page;
    this.commands = commands;
    this.validators = validators;
    this.accNavigation = accNavigation;
    this.pmGuidance = [
      "This page is for storing most project related supporting documents, including those uploaded by Innovate UK.",
      "Documents stored here are only accessible to Innovate UK, the Monitoring Officer and participants representing Hedge's Primary Ltd.",
      "You must upload supporting documents on the page you are submitting your claim or PCR. Do not use this page for claims or PCRs.",
    ];
    this.moGuidanceCopy = [
      "This page displays documents which are shared with Innovate UK and each project participant. Documents shared here are only accessible to the monitoring officer. Documents shared with the finance contact and project manager (for lead applicant), are accessible only to that participant, Innovate UK and the monitoring officer. When uploading documents, you can choose whether they are accessible by Innovate UK only, or with a participant.",
      "Do not select a participant if you wish to share the file with Innovate UK only.",
      "You must upload supporting documents on the page you are submitting your claim or PCR. Do not use this page for claims or PCRs.",
    ];

    this.filesUploadedSubheading = this.page.getByRole("heading").filter({ hasText: "Files uploaded" });
    this.sharedWithMoSubheading = this.page
      .getByRole("heading")
      .filter({ hasText: "Documents shared with Innovate UK and Monitoring Officer" });
    this.sharedWithPrimarySubheading = this.page
      .getByRole("heading")
      .filter({ hasText: "Documents for Hedge's Primary Ltd." });
    this.sharedWithPartnerSubheading = this.page
      .getByRole("heading")
      .filter({ hasText: "Documents shared with Innovate UK and partners" });
    this.uploadedGuidance = this.page
      .getByRole("paragraph")
      .filter({ hasText: "All documents uploaded will be shown here. All documents open in a new window." });
    this.partnerUploadGuidance = this.page.getByRole("paragraph").filter({ hasText: "No documents uploaded." });
    this.dropDown = this.page.locator("#description");
    this.dropDownOptions = [
      "-- No type --",
      "Review meeting",
      "Plans",
      "Collaboration agreement",
      "Risk register",
      "Annex 3",
      "Presentation",
      "Email",
      "Meeting agenda",
    ];
    this.accessControl = this.page.getByLabel("Access control");
    this.accessControlOptions = [
      "Innovate UK and MO only",
      "Innovate UK, MO and Hedge's Primary Ltd.",
      "Innovate UK, MO and Hedge's Secondary Ltd.",
    ];
    this.partnerDocTableHeaders = [
      ["File name", "testfile.xlsx"],
      ["Type", "Plans"],
      ["Date uploaded", this.commands.dateToday(true)],
      ["Size", "0KB"],
      ["Uploaded by", "Project Manager"],
      ["Shared with", "Hedge's Primary Ltd."],
    ];
  }

  @Given("the user can see the Documents heading")
  async isPage() {
    await this.commands.heading("Project documents");
  }

  @When("the user uploads a file in the documents area")
  async uploadFile() {
    await this.pmViewDocPage();
    await this.validators.testFileComponent("project", "Project overview", "Documents", false, false, "", "Plans");
    await this.validators.docTypeDropdown("Plans");
    await this.page.locator("css=#description").selectOption("Plans");
    await this.commands.fileInput(["testfile.doc"]);
  }

  @Then("a document table will be visible")
  async documentIsVisible() {
    await this.page.locator("css=td").getByRole("link").filter({ hasText: "testfile.doc" }).isVisible();
    await this.commands.deleteFileFromRow("testfile.doc");
  }

  @Then("the user can see an MO-specific documents page")
  async moDocPage() {
    await this.commands.heading("Project documents");
    await this.accessControlDropDown();
    await this.moGuidance();
    await this.sharedWithMoSubheading.isVisible();
    await this.sharedWithPartnerSubheading.isVisible();
    await this.typeDropDownList();
  }

  @When("the MO uploads a file intended for IUK only")
  async moUploadIUKOnly() {
    const access = this.page.getByLabel("Access Control");
    await access.selectOption(this.accessControlOptions[0]);
    await this.commands.fileInput(["testfile.doc"]);
    await this.commands.validationMessage("has been uploaded.");
    await this.commands.backLink("Back to project").click();
    await this.commands.heading("Project overview");
  }

  @Then("the PM user cannot see the file")
  async pmCannotSee() {
    await this.accNavigation.gotoProjectDocuments();
    await expect(this.page.getByText("testfile.doc")).not.toBeVisible();
  }

  @When("the PM uploads a file")
  async pmUploads() {
    await this.uploadNavigateBack("testfile.xlsx");
  }

  @Then("the MO can see the file uploaded")
  async moCanSeeFile() {
    await this.accNavigation.gotoProjectDocuments();
    await this.partnerDocTable();
  }

  @When("the MO uploads a file intended for Hedge's Primary Ltd.")
  async moUploadToSecondary(partnerName) {
    const access = this.page.getByLabel("Access Control");
    await access.selectOption(this.accessControlOptions[1]);
    await this.commands.fileInput(["testfile.pdf"]);
    await this.commands.validationMessage("has been uploaded.");
    await this.commands.backLink("Back to project").click();
    await this.commands.heading("Project overview");
  }

  @Then("the FC from a different partner cannot see the file")
  async fc2CannotSeeFiles() {
    await this.accNavigation.gotoProjectDocuments();
    await expect(this.page.getByText("testfile.doc")).not.toBeVisible();
    await expect(this.page.getByText("testfile.xlsx")).not.toBeVisible();
    await expect(this.page.getByText("testfile.pdf")).not.toBeVisible();
  }

  @When("the FC from the secondary partner uploads a file")
  async fc2UploadsFile() {
    await this.uploadNavigateBack("testfile.ppt");
  }

  @Then("the PM cannot see the secondary partner's file")
  async pmCannotSeeSecondary() {
    await this.accNavigation.gotoProjectDocuments();
    await expect(this.page.getByText("testfile.doc")).not.toBeVisible();
    await expect(this.page.getByText("testfile.ppt")).not.toBeVisible();
    await expect(this.page.getByText("testfile.xlsx")).toBeVisible();
  }

  /**
   * METHODS
   */

  async pmViewDocPage() {
    for (const guidance of this.pmGuidance) {
      await this.page.getByRole("paragraph").filter({ hasText: guidance }).isVisible();
      await this.filesUploadedSubheading.isVisible();
      await expect(this.sharedWithMoSubheading).not.toBeVisible();
      await this.sharedWithPrimarySubheading.isVisible();
      await this.uploadedGuidance.isVisible();
      await this.partnerUploadGuidance.isVisible();
      await this.typeDropDownList();
    }
  }

  async typeDropDownList() {
    for (const option of this.dropDownOptions) {
      const optionTag = this.page.locator("css=option").filter({ hasText: option });
      await this.dropDown.filter({ has: optionTag }).isVisible();
    }
  }

  async accessControlDropDown() {
    await this.accessControl.isVisible();
    for (const option of this.accessControlOptions) {
      const optionTag = this.page.locator("css=option").filter({ hasText: option });
      await this.dropDown.filter({ has: optionTag }).isVisible();
    }
  }

  async moGuidance() {
    for (const guidance of this.moGuidanceCopy) {
      await this.page.getByRole("paragraph").filter({ hasText: guidance }).isVisible();
    }
  }

  async partnerDocTable() {
    let i = 0;
    for (const [header, data] of this.partnerDocTableHeaders) {
      const th = this.page.getByRole("table").locator("th").nth(i).filter({ hasText: header });
      const td = this.page.getByRole("table").locator("td").nth(i).filter({ hasText: data });
      await expect(this.page.getByTestId("partner-documents-container").filter({ has: th })).toBeVisible();
      await expect(this.page.getByTestId("partner-documents-container").filter({ has: td })).toBeVisible();
      i++;
    }
  }

  async uploadNavigateBack(filename: string) {
    await this.validators.docTypeDropdown("Plans");
    await this.commands.fileInput([filename]);
    await this.commands.validationMessage("has been uploaded.");
    await this.commands.backLink("Back to project").click();
    await this.commands.heading("Project overview");
  }
}
