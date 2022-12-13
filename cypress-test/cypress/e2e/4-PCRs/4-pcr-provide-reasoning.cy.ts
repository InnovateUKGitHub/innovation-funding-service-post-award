import { visitApp } from "../../common/visit";
import { backToPCRs, backToSummary, shouldShowProjectTitle } from "./steps";

describe("Explain why you want to make the changes ", () => {
  before(() => {
    visitApp("projects/a0E2600000kSotUEAS/pcrs/a0G260000074KABEA2/prepare");
  });

  it("Should show back to summary link", backToPCRs);

  it("Should show the project title", shouldShowProjectTitle);

  it("Should show 'Explain why you want to make changes", () => {
    cy.get("h2.app-task-list__section").contains("Explain why you want to make the changes");
    cy.get("span.app-task-list__task-name").contains("Provide reasoning to Innovate UK").click();
  });
});
