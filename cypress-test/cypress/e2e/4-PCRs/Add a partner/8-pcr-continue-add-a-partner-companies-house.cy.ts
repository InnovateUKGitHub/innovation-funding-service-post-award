import { visitApp } from "../../../common/visit";
import {
  completeNewPartnerInfoAsBus,
  shouldShowProjectTitle,
  stateAidAddPartnerHeading,
  addPartnerCompanyHouseHeader,
  searchCompanyHouseGuidance,
  typeASearchResults,
  companyHouseAutofillAssert,
  saveContinueSaveSummary,
  specialCharInput,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Add partner > Continuing editing PCR Companies House section", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create an Add partner PCR", () => {
    cy.createPcr("Add a partner");
  });

  it("Should let you click 'Add a partner' and continue to the next screen", () => {
    cy.get("a").contains("Add a partner").click();
  });

  it("Should complete this page as a business and continue to the next page", completeNewPartnerInfoAsBus);

  it("Should display a 'Add a partner' heading and 'State aid eligibility' heading", stateAidAddPartnerHeading);

  it("Should click 'Save and continue' button", () => {
    cy.submitButton("Save and continue").click();
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading and 'Company house heading", addPartnerCompanyHouseHeader);

  it(
    "Should have a 'Search companies house' subheading and guidance information beneath search box",
    searchCompanyHouseGuidance,
  );

  it("Should enter special characters and assert that no errors are thrown", specialCharInput);

  it(
    "Should type 'A' in the search box and display 'Companies house search results' and the company 'A Limited'",
    typeASearchResults,
  );

  it(
    "Should auto-fill the 'Organisation name', 'Registration number' and 'Registered address' fields",
    companyHouseAutofillAssert,
  );

  it("Should have a 'Save and continue' button and a 'Save and return to summary' button", saveContinueSaveSummary);
});
