import { visitApp } from "../../../common/visit";
import {
  enterInvalidPostcode,
  enterNullPostcode,
  enterValidPostcode,
  newLocation,
  shouldShowProjectTitle,
} from "./steps";

const pmEmail = "james.black@euimeabs.test";

describe("js disabled > Project setup > IFS > Provide your project location postcode", { tags: "js-disabled" }, () => {
  before(() => {
    visitApp({ asUser: pmEmail, jsDisabled: true });
    cy.navigateToProject("365447");
  });

  beforeEach(() => {
    cy.disableJs();
  });

  it("Should navigate to 'Provide your project location postcode' section", () => {
    cy.get("a").contains("Provide your project location postcode").click();
    cy.heading("Provide your project location postcode");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to set up your project");
  });

  it("Should show the project title.", shouldShowProjectTitle);

  it("Should show 'New location' information.", newLocation);

  it("Should enter an invalid postcode and validate.", enterInvalidPostcode);

  it("Should clear the post code and attempt to submit with a null field, triggering validation", enterNullPostcode);

  it("Should enter a valid postcode and proceed to save and retun to project setup screen.", enterValidPostcode);
});
