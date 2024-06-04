import { visitApp } from "common/visit";
import { testEach } from "support/methods";
import {
  accessForecastsCheckForMessaging,
  accessPcrTileCheckReadOnly,
  accessProjectCard,
  accessTileAndCheckOnHoldMessage,
  checkClaimsTileforMessaging,
  checkEachPcrForMessaging,
  checkViewOnlyClaim,
  onHoldMessage,
  suspensionNotificationShouldNotExist,
} from "./steps";

const pm = "james.black@euimeabs.test";

describe("On hold project > Flagged participant > PM view.", { tags: "smoke" }, () => {
  before(() => {
    visitApp({ asUser: pm, path: "projects/dashboard" });
  });

  it("Should display the project card for 569082 and access the project", () => accessProjectCard("569082"));

  it("Should display an on hold warning message", () => {
    onHoldMessage();
    suspensionNotificationShouldNotExist();
  });

  it("Should access the Claims tile and check for the correct messaging and that a Draft claim can only be viewed not edited", () => {
    checkClaimsTileforMessaging();
    suspensionNotificationShouldNotExist();
  });

  it("Should click into the view-only claim and have the message persist", checkViewOnlyClaim);

  it("Should navigate back to the project overview", () => {
    cy.clickOn("Back to project");
    cy.heading("Project overview");
    onHoldMessage();
    suspensionNotificationShouldNotExist();
  });

  it("Should access Forecasts and check for messaging and view-only forecasts", accessForecastsCheckForMessaging);

  it("Should navigate back to the project overview", () => {
    cy.clickOn("Back to project");
    cy.heading("Project overview");
    onHoldMessage();
    suspensionNotificationShouldNotExist();
  });

  it(
    "Should access the PCR tile and display a list of Project Change requests with 'View' links",
    accessPcrTileCheckReadOnly,
  );

  it("Should display an on hold warning message", () => {
    onHoldMessage();
    suspensionNotificationShouldNotExist();
  });

  it("Should access each PCR in turn and check that the warning message is present", checkEachPcrForMessaging);

  it("Should navigate back to the project overview", () => {
    cy.clickOn("Back to project");
    cy.heading("Project overview");
    onHoldMessage();
    suspensionNotificationShouldNotExist();
  });

  testEach(["Documents", "Project details", "Finance summary"])(
    `should access the "$0" tile and assert for correct messaging`,
    accessTileAndCheckOnHoldMessage,
  );
});
