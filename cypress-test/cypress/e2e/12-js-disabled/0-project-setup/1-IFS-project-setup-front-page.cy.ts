import { visitApp } from "../../../common/visit";
import { giveUsInformation, shouldShowProjectTitle } from "./steps";

const pmEmail = "james.black@euimeabs.test";

describe("js disabled > Project setup > IFS > general", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ asUser: pmEmail, jsDisabled: true });
    cy.navigateToProject("365447");
  });

  beforeEach(() => {
    cy.disableJs();
  });

  it("Should have a 'Project setup' page heading with guidance text", () => {
    cy.heading("Project setup");
    cy.paragraph("We will need some information before we can complete project setup.");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to projects");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should have a 'Give us information' subheading and list of requirements", giveUsInformation);

  it("Should have a 'Complete project setup' button", () => {
    cy.submitButton("Complete project setup");
  });
});
