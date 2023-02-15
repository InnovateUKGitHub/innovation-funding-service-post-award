import { visitApp } from "../../common/visit";
import { shouldShowAllAccordion, shouldShowProjectTitle } from "./steps";

describe("claims > open claims as FC", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/overview" });
  });

  describe("FC should be able to navigate to the claims page", () => {
    it("clicking Claims will navigate to claims screen", () => {
      cy.selectTile("Claims");
    });
    it("Should have a back option", () => {
      cy.backLink("Back to project");
    });
    it("Should have the project name displayed", shouldShowProjectTitle);

    it("Should display messaging", () => {
      cy.getByQA("guidance-message").should("contain.text", "evidence");
    });
    it("Should have an Open section", () => {
      cy.get("h2").contains("Open");
    });

    it("Should have a Closed section", () => {
      cy.get("h2").contains("Closed");
    });

    it("Should show a claim", () => {
      cy.get("h3").should("contain.text", "Period");
    });

    it("Should have Show all sections option", shouldShowAllAccordion);
  });
});
