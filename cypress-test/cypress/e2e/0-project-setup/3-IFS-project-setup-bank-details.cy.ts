import { visitApp } from "../../common/visit";
import {
  bankDetailsValidation,
  correctSyntaxInvalidDetails,
  correctSyntaxValidation,
  fillAccountInfoInvalid,
  fillAccountInformation,
  fillAddressInformation,
  fillOrgInformation,
  shouldShowProjectTitle,
  validateInvalidAccDetails,
} from "./steps";

const pmEmail = "james.black@euimeabs.test";

describe("Project setup > IFS > Provide your bank details", () => {
  before(() => {
    visitApp({ asUser: pmEmail });
    cy.navigateToProject("365447");
  });

  it("Should navigate to 'Provide your bank details' section", () => {
    cy.get("a").contains("Provide your bank details").click();
    cy.heading("Provide your bank details");
  });

  it("Should have a back option", () => {
    cy.backLink("Back to set up your project");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should have the page title", () => {
    cy.heading("Provide your bank details");
  });

  it("Should have guidance information", () => {
    cy.paragraph(
      "In order for us to pay your grant we need the bank details of your organisation. The bank account must belong to the organisation listed.",
    );
  });

  it("Should attempt to submit without data and trigger validation messaging", bankDetailsValidation);

  it("Should have an 'Organisation information' section and populate 'Company number'", fillOrgInformation);

  it("Should enter invalid syntax account information and attempt to submit", fillAccountInfoInvalid);

  it("Should display a validation error due to invalid account information.", validateInvalidAccDetails);

  it("Should enter valid syntax but invalid account information and attempt to submit.", correctSyntaxInvalidDetails);

  it("Should display a validation error caused by the invalid account information", correctSyntaxValidation);

  it("Should have an 'Account details' section and populate 'Sort code'", fillAccountInformation);

  it("Should no longer display the validation message", () => {
    cy.reload();
    cy.getByQA("validation-summary").should("not.exist");
  });

  it("Should have a 'Billing address' section and populate the address", fillAddressInformation);

  it("Should have a 'Submit bank details' button", () => {
    cy.submitButton("Submit bank details");
  });
});
