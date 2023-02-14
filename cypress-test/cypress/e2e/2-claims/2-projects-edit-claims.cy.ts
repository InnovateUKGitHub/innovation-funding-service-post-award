import { visitApp } from "../../common/visit";
import { accessOpenClaim, shouldShowAllAccordion, shouldShowCostCatTable, shouldShowProjectTitle } from "./steps";

describe("claims > edit claims as FC", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/overview" });
  });

  describe("FC should be able to navigate to the claims page", () => {
    it("clicking Claims will navigate to claims screen", () => {
      cy.selectTile("Claims");
    });

    describe("FC should be able to click edit on an open claim", () => {
      it("Displays a claim in draft state", accessOpenClaim);

      it("Should have a back option", () => {
        cy.backLink("Back to claims");
      });

      describe("The edit claims screen should show the following", () => {
        it("Displays the project title", shouldShowProjectTitle);

        it("Displays the period information", () => {
          cy.get("h2").should("contain.text", "Period");
        });

        it("Displays the cost category table", shouldShowCostCatTable);

        it("Should have continue to claims documents button", () => {
          cy.submitButton("Continue to claims documents");
        });

        it("Should have a save and return to claims button", () => {
          cy.submitButton("Save and return to claims");
        });

        it("Should show accordions", shouldShowAllAccordion);

        it("The Continue to claims button should direct you to the next page", () => {
          cy.submitButton("Continue to claims documents").click();
        });
      });
    });
  });
});
