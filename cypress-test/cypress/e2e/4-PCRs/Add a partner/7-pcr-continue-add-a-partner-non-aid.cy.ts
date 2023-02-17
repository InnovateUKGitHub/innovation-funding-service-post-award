import { visitApp } from "../../../common/visit";
import {
  shouldShowProjectTitle,
  completeNewPartnerInfoNonAid,
  clickCreateRequestButtonProceed,
  nonAidAddPartnerHeading,
  saveContinueSaveSummary,
  stateAidFurtherInfo,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Add partner > Continuing editing PCR as a non-aid organisation", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Add a partner");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should select 'Add a partner' checkbox", () => {
    cy.clickCheckBox("Add a partner");
  });

  it("Will click Create request button and proceed to next page", clickCreateRequestButtonProceed);

  it("Should let you click 'Add a partner' and continue to the next screen", () => {
    cy.get("a").contains("Add a partner").click();
  });

  it("Should complete this page as a business and continue to the next page", completeNewPartnerInfoNonAid);

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading and 'Non-aid funding' heading", nonAidAddPartnerHeading);

  it("Should have further information on state aid eligibility", stateAidFurtherInfo);

  it("Should have a 'Save and continue' button and a 'Save and return to summary' button", saveContinueSaveSummary);
});
