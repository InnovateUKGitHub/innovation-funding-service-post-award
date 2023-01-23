import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  deletePcr,
  completeNewPartnerInfoAsResearch,
  clickCreateRequestButtonProceed,
  stateAidAddPartnerHeading,
  saveContinueSaveSummary,
} from "../steps";

describe("Continuing editing Add a partner PCR as research", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/create" });
  });

  after(() => {
    deletePcr();
  });

  it("Should select 'Add a partner' checkbox", () => {
    cy.clickCheckBox("Add a partner");
  });

  it("Will click Create request button and proceed to next page", clickCreateRequestButtonProceed);

  it("Should let you click 'Add a partner' and continue to the next screen", () => {
    cy.get("a").contains("Add a partner", { timeout: 10000 }).click();
  });

  it("Should complete this page as a business and continue to the next page", completeNewPartnerInfoAsResearch);

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading and 'State aid eligibility' heading", stateAidAddPartnerHeading);

  it("Should have further information on state aid eligibility", () => {
    cy.get("p").contains("If we decide to award this organisation");
  });

  it("Should have a 'Save and continue' button and a 'Save and return to summary' button", saveContinueSaveSummary);
});
