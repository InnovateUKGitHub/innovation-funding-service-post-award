import { visitApp } from "common/visit";
import {
  partnerRadioButtons,
  removePartnerContinueNoEdit,
  removePartnerPromptValidation,
  shouldShowProjectTitle,
  validatePeriodBox,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

const pm = "james.black@euimeabs.test";

describe(
  "js disabled > PCR > Remove partner > Begin editing the Remove a partner section",
  { tags: "js-disabled" },
  () => {
    before(() => {
      visitApp({ asUser: pm, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard", jsDisabled: true });
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
      cy.heading("Remove a partner");
    });

    it("Should show the project title", shouldShowProjectTitle);

    it("Should have a subheading for 'Select partner to remove'", () => {
      cy.get("legend").contains("Select partner to remove");
    });

    it("Should have a list of partners and the option to select which partner you wish to remove", partnerRadioButtons);

    it("Should have a 'When is their last period?' heading", () => {
      cy.get("legend").contains("When is their last period?");
    });

    it("Should have guidance information", () => {
      cy.get("#hint-for-removalPeriod").contains(
        "The partner can make a claim for this period before being removed. If they have a claim in progress, they will be removed once that claim has been paid.",
      );
    });

    it("Should 'Save and continue' having entered nothing and selected nothing", removePartnerContinueNoEdit);

    it("Should mark as complete and attempt to save prompting validation", removePartnerPromptValidation);

    it("Should use the edit button next to 'Partner being removed' to navigate back", () => {
      cy.getListItemFromKey("Partner being removed", "Edit").click();
      cy.get("legend").contains("Select partner to remove");
    });

    it("Should validate the period box", validatePeriodBox);

    it("Should have a working backlink", () => {
      cy.backLink("Back to request").click();
      cy.heading("Request");
    });
  },
);
