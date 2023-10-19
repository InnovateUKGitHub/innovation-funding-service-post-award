import { visitApp } from "common/visit";
import {
  clearAndRevertPostodes,
  editEachPartner,
  ensureTableIsPopulated,
  navigateToPartnerHeadings,
  reflectChangesMade,
  shouldShowProjectTitle,
  showUpdatedPostcodes,
} from "./steps";
import { partnerValidation } from "./steps";

describe("Project details > Edit partner information", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/details" });
  });

  it("Should display the project details page", () => {
    cy.heading("Project details");
  });

  it("Should have the project title", shouldShowProjectTitle);

  it("Should navigate to a partner information screen and ensure page headings are correct", navigateToPartnerHeadings);

  it(
    "Should ensure the table is correctly populated before navigating back to the project details page",
    ensureTableIsPopulated,
  );

  it("Should click into each partner in turn and edit the postcode", editEachPartner);

  it(
    "Should now show the updated information from Partner information on the Project details page",
    showUpdatedPostcodes,
  );

  it("Should click into a partner and check for validation", partnerValidation);

  it("Should clear the post codes entered back to 'SN5'", clearAndRevertPostodes);

  it("Should reflect the changes made on project details", reflectChangesMade);
});
