import { visitApp } from "common/visit";
import {
  shouldShowProjectTitle,
  completeNewPartnerInfoNonAid,
  nonAidAddPartnerHeading,
  saveContinueSaveSummary,
  stateAidFurtherInfo,
} from "../steps";
import { nonAidSummaryIncomplete, companyHouseSwindonUniversity } from "./add-partner-e2e-steps";
import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Add partner > Continuing editing PCR as a non-aid organisation", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard", jsDisabled: true });
    pcrTidyUp("Add a partner");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  beforeEach(() => {
    cy.disableJs();
  });

  it("Should create an Add partner PCR", () => {
    cy.createPcr("Add a partner", { jsDisabled: true });
  });

  it("Should let you click 'Add a partner' and continue to the next screen", () => {
    cy.get("a").contains("Add a partner").click();
  });

  it("Should complete this page as academic and continue to the next page", completeNewPartnerInfoNonAid);

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading and 'Non-aid funding' heading", nonAidAddPartnerHeading);

  it("Should have further information on state aid eligibility", stateAidFurtherInfo);

  it("Should have a 'Save and continue' button and a 'Save and return to summary' button", saveContinueSaveSummary);

  it("Should save and return to Summary and check the full details of the page", nonAidSummaryIncomplete);

  it("Should access Organisation name' section", () => {
    cy.getListItemFromKey("Organisation name", "Edit").click();
    cy.get("legend").contains("Search for organisation");
    cy.getByQA("jes-organisation-info-content").contains(
      "Your organisation must be registered on Je-S before we will consider you to be a research organisation.",
    );
    cy.get("#hint-for-searchJesOrganisations").contains("Enter the name of the organisation that you work for.");
  });

  it("Should validate the search box", () => {
    cy.get(`input[id="searchJesOrganisations"]`).clear().type("Can I pet that dawg");
    cy.paragraph(
      "Is your organisation not showing in these results? Check your spelling, or try searching again using a more specific company name or the registration number.",
    );
  });

  it("Should type 'Swindon' and select 'Swindon University", companyHouseSwindonUniversity);

  it("Should show Swindon University under the organisation listing", () => {
    cy.get("h2").contains("Organisation");
    cy.getListItemFromKey("Organisation name", "Swindon University");
  });
});
