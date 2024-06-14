import { visitApp } from "common/visit";
import {
  clickIntoPartnerTable,
  clickViewLoadUplift,
  displayUpliftInProgress,
  upliftListItems,
  upliftPartnerTable,
  validateEuiSmallEntUplift,
  validateSwindonDevUni,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

const pm = "b.potter@test.co.uk";
const mo = "testman2@testing.com";
const fc = "contact77@test.co.uk";

describe("PCR > Uplift > View", () => {
  before(() => {
    visitApp({ asUser: pm, path: "projects/a0E2600000kTirsEAC/pcrs/dashboard" });
  });

  it("Should display an Uplift PCR in progress and click view to access it.", clickViewLoadUplift);

  it("Should display correct list items at the top of the page.", upliftListItems);

  it("Should display partner table with costs.", upliftPartnerTable);

  it("Should click into EUI Small Ent Health (Lead) and display the page heading", () =>
    clickIntoPartnerTable("EUI Small Ent Health"));

  it("Should validate the EUI Small Ent Health table is correct.", validateEuiSmallEntUplift);

  it("Should navigate back to the Uplift view.", () => {
    cy.clickOn("Back to summary");
    cy.getListItemFromKey("Request number", "183");
  });

  it("Should click into Swindon Development University.", () =>
    clickIntoPartnerTable("Swindon Development University"));

  it("Should validate the Swindon Development University.", validateSwindonDevUni);

  it("Should navigate back to the Uplift view.", () => {
    cy.clickOn("Back to summary");
    cy.getListItemFromKey("Request number", "183");
  });

  it("Should back out to the PCR dashboard.", () => {
    cy.clickOn("Back to project change requests");
    cy.heading("Project change requests");
  });

  it("Should switch user to MO.", () => {
    cy.switchUserTo(mo);
  });

  it("Should display an Uplift PCR in progress.", displayUpliftInProgress);

  it("Should click 'View' and load the PCR.", clickViewLoadUplift);

  it("Should display correct list items at the top of the page.", upliftListItems);

  it("Should display partner table with costs.", upliftPartnerTable);

  it("Should click into EUI Small Ent Health (Lead) and display the page heading", () =>
    clickIntoPartnerTable("EUI Small Ent Health"));

  it("Should validate the EUI Small Ent Health table is correct.", validateEuiSmallEntUplift);

  it("Should navigate back to the Uplift view.", () => {
    cy.clickOn("Back to summary");
    cy.getListItemFromKey("Request number", "183");
  });

  it("Should click into Swindon Development University.", () =>
    clickIntoPartnerTable("Swindon Development University"));

  it("Should validate the Swindon Development University.", validateSwindonDevUni);

  it("Should navigate back to the Uplift view.", () => {
    cy.clickOn("Back to summary");
    cy.getListItemFromKey("Request number", "183");
  });

  it("Should back out to the PCR dashboard.", () => {
    cy.clickOn("Back to project change requests");
    cy.heading("Project change requests");
  });

  it("Should switch user to an FC.", () => {
    cy.switchUserTo(fc);
  });

  it("Should not display a view button.", () => {
    cy.getByQA("pcrViewItemLink").should("not.exist");
  });
});
