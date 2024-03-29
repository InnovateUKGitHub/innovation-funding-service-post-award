import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  completeNewPartnerInfoAsPublic,
  stateAidAddPartnerHeading,
  saveContinueSaveSummary,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Add partner > Continuing editing PCR as Public organisation", () => {
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

  it("Should complete this page as a business and continue to the next page", completeNewPartnerInfoAsPublic);

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading and 'State aid eligibility' heading", stateAidAddPartnerHeading);

  it("Should have further information on state aid eligibility", () => {
    cy.paragraph("If we decide to award this organisation");
  });

  it("Should have a 'Save and continue' button and a 'Save and return to summary' button", saveContinueSaveSummary);
});
