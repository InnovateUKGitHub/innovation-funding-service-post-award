import { visitApp } from "../../../common/visit";
import {
  reallocateCostsGiveUsInfoContinue,
  reallocateCostsAndPartner,
  reallocateCostsCats,
  reallocateCostsTableHeaders,
  shouldShowProjectTitle,
  showPartners,
  partnerTableWithUnderspend,
  updateABCad,
  updateEUICosts,
  partnerTableWithOverspend,
  reaccessABCadReduce,
  validateCostUpdateInputs,
  validateGrantMoving,
  changeRemainingGrantPage,
  updateNewRemainingGrant,
  reduceNewRemainingGrant,
  saveReflectSurplus,
  restoreRemainingGrant,
  negativeGrantChange,
  validateAlphaCharacters,
  saveZeroValue,
  reallocateDecimals,
  increaseSinglePartnerOver100,
  revertToPreviousValues,
  changeRemainingGrantRounding,
} from "../steps";
import { pcrTidyUp } from "common/pcrtidyup";

const projManager = "james.black@euimeabs.test";

describe("PCR > Reallocate Costs > 3 - Continues Reallocate costs to the costs tables page to access each partner", () => {
  before(() => {
    visitApp({ asUser: projManager, path: "projects/a0E2600000kSotUEAS/pcrs/dashboard" });
    pcrTidyUp("Reallocate project costs");
  });

  after(() => {
    cy.deletePcr("328407");
  });

  it("Should create a Reallocate Partner costs PCR", () => {
    cy.createPcr("Reallocate project costs");
  });

  it("Should select 'Give us information' and continue to the next page", reallocateCostsGiveUsInfoContinue);

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display reallocate costs table headers", reallocateCostsTableHeaders);

  it("Should show the partners listed", showPartners);

  it("Should allow you to navigate to EUI Small Ent Health", () => {
    cy.get("td.govuk-table__cell").contains("EUI Small Ent Health").click();
  });

  it("Should have a back option", () => {
    cy.backLink("Back to summary");
  });

  it("Should show the project title", shouldShowProjectTitle);

  it("Should display a 'Reallocate costs' heading and partner name", reallocateCostsAndPartner);

  it("Should display the reallocate costs table cost categories", reallocateCostsCats);

  it("Should display a 'Summary of project costs' section", () => {
    cy.tableHeader("Total eligible costs");
  });

  /**
   * This assumes the value in the current box is 35000 as per project creation script
   */

  it("Should validate an empty 'New total eligible costs'", () => {
    cy.getByAriaLabel("Labour").clear();
    cy.clickOn("Save and return to reallocate project costs");
    cy.validationLink("Enter new total eligible costs.");
    cy.paragraph("Enter new total eligible costs.");
  });

  it(
    "Should confirm that decimals are saving and rounding correctly in conjunction with grant calculation.",
    reallocateDecimals,
  );

  it("Should go back into EUI costs", () => {
    cy.get("td.govuk-table__cell").contains("EUI Small Ent Health").click();
  });
  it("Should update costs for re-distribution", updateEUICosts);

  it("Should have a 'Save and return to reallocate project costs' button", () => {
    cy.submitButton("Save and return to reallocate project costs").click();
  });

  it("Should return to the 'Reallocate costs screen", () => {
    cy.heading("Reallocate project costs");
  });

  it("Should display a warning message regarding the underspend/surplus amount", () => {
    cy.getByQA("validation-message-content").contains(
      "Your 'Remaining grant' has a surplus of £35,751.50. You may lose this project surplus permanently if you do not reallocate these funds before you submit this PCR.",
    );
  });

  it("Should display the updated partner table with revised costs", partnerTableWithUnderspend);

  it("Should access A B Cad Services and begin updating the costs", updateABCad);

  it("Should save and return to reallocate project costs", () => {
    cy.clickOn("Save and return to reallocate project costs");
    cy.heading("Reallocate project costs");
  });

  it("Should display messaging surrounding an overspend", () => {
    cy.getByQA("validation-message-content").contains(
      "You must reduce your 'New remaining grant' project total to £341,900.00 or less, because you have exceeded it by £1,298.50. You can change each partner’s 'Remaining grant' to reduce the project total to the amount agreed.",
    );
  });

  it("Should display a revised partner table with totals with the overspend", partnerTableWithOverspend);

  it("Should re-access A B Cad Services and reduce costs in line with total grant value", reaccessABCadReduce);

  it("Should no longer show validation message stating overspend", () => {
    cy.get("main").within(() => {
      cy.getByQA("validation-message-content").should(
        "not.have.text",
        "You must reduce your 'New remaining grant' project total to £341,900.00 or less, because you have exceeded it by £1,298.50. You can change each partner’s 'Remaining grant' to reduce the project total to the amount agreed.",
      );
    });
  });

  it("Should navigate back into EUI and validate the inputs", validateCostUpdateInputs);

  it("Should click the backlink to return to the partner table.", () => {
    cy.backLink("Back to summary").click();
    cy.heading("Reallocate project costs");
  });

  it("Should present remaining grant copy", () => {
    cy.paragraph(
      "If the new remaining grant is higher as a result of the reallocation of costs, you can change the funding level of partners to lower the new project grant.",
    );
  });

  /**
   * Change remaining grant section
   */
  it("Should access the 'Change remaining grant section", () => {
    cy.clickOn("Change remaining grant");
    cy.heading("Change remaining grant");
  });

  it("Should verify the correct copy exists and the partner table", changeRemainingGrantPage);

  it("Should validate an empty 'New remaining grant' field", () => {
    cy.getByAriaLabel("EUI Small Ent Health new remaining grant").clear();
    cy.clickOn("Save and return to reallocate project costs");
    cy.validationLink("Enter new remaining grant.");
    cy.paragraph("Enter new remaining grant.");
    cy.getByAriaLabel("EUI Small Ent Health new remaining grant").clear().type("-1000");
    cy.clickOn("Save and return to reallocate project costs");
    cy.validationLink("New remaining grant must be £0.00 or more.");
    cy.paragraph("New remaining grant must be £0.00 or more.");
    ["lorem", "&", "!£%^&*"].forEach(input => {
      cy.getByAriaLabel("EUI Small Ent Health new remaining grant").clear().type(input);
      cy.validationLink("New remaining grant must be a number.");
      cy.paragraph("New remaining grant must be a number.");
    });
    ["€", "$"].forEach(currency => {
      cy.getByAriaLabel("EUI Small Ent Health new remaining grant").clear().type(currency);
      cy.validationLink("New remaining grant must be in pounds (£).");
      cy.paragraph("New remaining grant must be in pounds (£).");
    });
    cy.backLink("Back to summary").click();
    cy.heading("Reallocate project costs");
    cy.clickOn("Change remaining grant");
    cy.heading("Change remaining grant");
  });

  it(
    "Should update the New remaining grant values which in turn, update the New funding level percentages",
    updateNewRemainingGrant,
  );

  it("Should attempt to save the increase in grant, prompting validation", () => {
    cy.clickOn("Save and return to reallocate project costs");
    cy.validationLink("The total grant cannot exceed the remaining grant.");
    cy.paragraph("The total grant cannot exceed the remaining grant.");
  });

  it("Should attempt to enter a negative number, prompting validation", negativeGrantChange);

  it("Should validate that alpha characters aren't allowed", validateAlphaCharacters);

  it("Should reduce the grant value to below the remaining grant value", reduceNewRemainingGrant);

  it("Should save and reflect on the previous page this changes and surplus", saveReflectSurplus);

  it("Should show validation pertaining to surplus of £3", () => {
    cy.getByQA("validation-message-content").contains(
      "Your 'Remaining grant' has a surplus of £3.00. You may lose this project surplus permanently if you do not reallocate these funds before you submit this PCR.",
    );
  });

  it("Should ensure a zero can be saved as a value", saveZeroValue);

  it("Should go back into Change remaining grant and reduce figure by £3.00", restoreRemainingGrant);

  it(
    "Should increase one partner to above 100% grant, keeping the project total within total allowed and correctly validate",
    increaseSinglePartnerOver100,
  );

  it("Should return to the previous values and save correctly", revertToPreviousValues);

  it("Should access the 'Change remaining grant section", () => {
    cy.clickOn("Change remaining grant");
    cy.heading("Change remaining grant");
  });

  it("Should check that pennies are rounded correctly and calculate correctly", changeRemainingGrantRounding);

  it("Has an input box for grant moving over financial year and will validate the input", validateGrantMoving);

  it("Has a save and return to request button", () => {
    cy.submitButton("Save and return to request").click();
  });

  it("Should reflect that the section is complete", () => {
    cy.get("span").contains("Complete");
  });
});
