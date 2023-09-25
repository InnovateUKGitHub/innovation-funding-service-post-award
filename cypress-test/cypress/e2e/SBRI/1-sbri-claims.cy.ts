import { visitApp } from "common/visit";
import { accessEUIOpenClaim } from "e2e/2-claims/steps";

const sbriFC = "s.shuang@irc.trde.org.uk.test";
describe("SBRI > Claims", () => {
  before(() => {
    visitApp({ asUser: sbriFC });
    cy.navigateToProject("597638");
  });

  it("Should click the Claims tile and navigate to claims section", () => {
    cy.selectTile("Claims");
    cy.heading("Claims");
  });

  it("Should access the open claim", () => {
    cy.get("a").contains("Edit").click();
    cy.heading("Costs to be claimed");
  });

  it("Should navigate through to the forecast section", () => {
    cy.button("Continue to claims documents").click();
    cy.heading("Claim documents");
    cy.get("a").contains("Continue to update forecast").click();
    cy.heading("Update forecast");
  });

  it("Should no longer have older messaging", () => {
    cy.getByQA("validation-message-content").should("not.exist");
  });

  it("Should currently be displaying underspend messaging", () => {
    [
      "The total of your actual costs claimed and forecasted costs is different than the agreed for:",
      "Labour",
      "Overheads",
      "Materials",
      "Capital usage",
      "Subcontracting",
      "Travel and subsistence",
      "Other costs",
      "VAT",
      "Please add a comment for the attention of your Monitoring Officer, if you are forecasting to underspend on the contract value offered.",
    ].forEach(advice => {
      cy.get("p").contains(advice);
    });
  });

  it("Should display messaging when over claiming", () => {
    [
      "Labour Period 2",
      "Overheads Period 2",
      "Materials Period 2",
      "Capital usage Period 2",
      "Subcontracting Period 2",
      "Travel and subsistence Period 2",
      "Other costs Period 2",
      "VAT Period 2",
    ].forEach(category => {
      cy.getByAriaLabel(category).clear().type("50000");
      [
        "The total of your actual costs claimed and forecasted costs is different than the agreed for:",
        "Labour",
        "Overheads",
        "Materials",
        "Capital usage",
        "Subcontracting",
        "Travel and subsistence",
        "Other costs",
        "VAT",
        "Please add a comment for the attention of your Monitoring Officer, if you are forecasting to underspend on the contract value offered.",
      ].forEach(advice => {
        cy.get("p").contains(advice);
      });
    });
  });
});
