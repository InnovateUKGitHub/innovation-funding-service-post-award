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
import { loremIpsum159Char } from "common/lorem";

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

  it("Should accept 159 characters", () => {
    cy.get("#searchCompaniesHouse").clear().invoke("val", loremIpsum159Char).trigger("input");
    cy.getByQA("error-summary").should("not.exist");
  });

  it("Should increase character count to 160 characters", () => {
    cy.get("#searchCompaniesHouse").type("{moveToEnd}t");
    cy.getByQA("error-summary").should("not.exist");
  });

  it("Should have a value in the input box of 160 characters", () => {
    cy.get("#searchCompaniesHouse").should("have.value", loremIpsum159Char + "t");
    cy.getByQA("error-summary").should("not.exist");
  });

  it("Should attempt to enter another character bringing it to 161 characters", () => {
    cy.get("#searchCompaniesHouse").type("{moveToEnd}t");
    cy.getByQA("error-summary").should("not.exist");
  });

  it("Should attempt to do so again bringing total to 162 characters", () => {
    cy.get("#searchCompaniesHouse").type("{moveToEnd}t");
    cy.getByQA("error-summary").should("not.exist");
  });

  it("Should still only contain the 160 characters in the input", () => {
    cy.get("#searchCompaniesHouse").should("have.value", loremIpsum159Char + "t");
    cy.getByQA("error-summary").should("not.exist");
  });

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
