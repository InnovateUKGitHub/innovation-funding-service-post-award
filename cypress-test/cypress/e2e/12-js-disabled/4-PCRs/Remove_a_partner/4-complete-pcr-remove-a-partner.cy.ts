import { visitApp } from "common/visit";
import {
  shouldShowProjectTitle,
  pcrDocUpload,
  clickPartnerAddPeriod,
  removePartnerTable,
  removePartnerEditLinks,
  removePartnerMarkAsComplete,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

const pmEmail = "james.black@euimeabs.test";

describe(
  "js disabled > PCR > Remove partner > Continuing editing the Remove a partner section once a partner is selected",
  { tags: "js-disabled" },
  () => {
    before(() => {
      visitApp({ asUser: pmEmail, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard", jsDisabled: true });
      pcrTidyUp("Draft");
    });

    beforeEach(() => {
      cy.disableJs();
    });

    after(() => {
      cy.deletePcr("328407");
    });

    it("Should create a Remove partner PCR", () => {
      cy.createPcr("Remove a partner", { jsDisabled: true });
    });

    it("Should click the Remove partner link to begin editing the PCR", () => {
      cy.get("a").contains("Remove a partner").click();
    });

    it("Should click a partner name before entering a period number and proceeding", clickPartnerAddPeriod);

    it("should allow you to upload a file", pcrDocUpload);

    it("Should have a 'Save and continue' button", () => {
      cy.submitButton("Save and continue").click();
      cy.get("legend").contains("Mark as complete");
    });

    it("Should have a back option", () => {
      cy.backLink("Back to request");
    });

    it("Should show the project title", shouldShowProjectTitle);

    it("Should have the page title 'Remove a partner'", () => {
      cy.heading("Remove a partner");
    });

    it(
      "Should display a remove partner table containing information on the request entered so far",
      removePartnerTable,
    );

    it("Should ensure the 'Edit' links are working correctly", removePartnerEditLinks);

    it("Has a subheading 'Mark as complete' with an 'I agree with this change' checkbox", removePartnerMarkAsComplete);

    it("Should save and return to request", () => {
      cy.submitButton("Save and return to request").click();
    });

    it("Should show that the first section has completed", () => {
      cy.get("strong").contains("Complete");
    });
  },
);
