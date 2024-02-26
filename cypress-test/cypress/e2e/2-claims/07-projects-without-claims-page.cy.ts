import { visitApp } from "../../common/visit";
import { openClosedSection, shouldShowProjectTitle } from "./steps";

const fcContact = "contact77@test.co.uk";

describe("claims > projects without claims", () => {
  before(() => {
    visitApp({ asUser: fcContact, path: "projects/a0E2600000kSotUEAS/overview" });
  });

  it("clicking Claims will navigate to claims screen", () => {
    cy.selectTile("Claims");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to project");
  });

  it("Should have the project name displayed", shouldShowProjectTitle);

  it("Should display the 'Claims' heading", () => {
    cy.heading("Claims");
  });

  it("Should display messaging", () => {
    cy.getByQA("guidance-message").contains("All partners in this project must upload evidence");
    cy.get("a").contains("Managing Public Money government handbook");
  });

  it("Should have an Open and Closed section", openClosedSection);
});
