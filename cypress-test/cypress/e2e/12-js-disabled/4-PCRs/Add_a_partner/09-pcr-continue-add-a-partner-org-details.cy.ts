import { visitApp } from "common/visit";
import {
  shouldShowProjectTitle,
  saveContinueSaveSummary,
  navigateToPartnerOrgPage,
  addPartnerSize,
  addPartnerSizeOptions,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

describe("PCR > Add partner > Continuing editing PCR organisation details section", { tags: "js-disabled" }, () => {
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

  it("Should navigate to the Partner organisation page", navigateToPartnerOrgPage);

  it("Should display the subheading 'Organisation details'", () => {
    cy.get("h2").contains("Company house");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to request");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Add a partner' heading", () => {
    cy.heading("Add a partner");
  });

  it("Should have a 'Size' subheading and guidance information", addPartnerSize);

  it("Should have 'Small', 'Medium' and 'Large' radio button options and click in turn", addPartnerSizeOptions);

  it("Should have a 'Number of full time employees' subheading and enter 1000 in the text box", () => {
    cy.get("legend").contains("Number of full time employees");
    cy.getByAriaLabel("number of full-time employees").type("1000");
  });

  it("Should have a 'Save and continue' button and a 'Save and return to summary' button", saveContinueSaveSummary);
});
