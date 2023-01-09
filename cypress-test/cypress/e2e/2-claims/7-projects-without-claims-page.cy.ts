import { visitApp } from "../../common/visit";
import { shouldShowProjectTitle } from "./steps";

describe("project dashboard as Finance Contact", () => {
  before(() => {
    visitApp({ path: "projects/a0E2600000kSotUEAS/overview" });
  });

  describe("FC should be able to navigate to the claims page", () => {
    it("clicking Claims will navigate to claims screen", () => {
      cy.get("h2.card-link__title").contains("Claims").click();
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

    /**
     * @see https://ukri.atlassian.net/browse/ACC-9060
     */
    it("Open & Closed section should have correct messaging", () => {
      cy.get("p.govuk-body").should("not.contain", "{{nextClaimStartDate}}");
    });
  });
});
