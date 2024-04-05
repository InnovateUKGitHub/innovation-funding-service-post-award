import { visitApp } from "common/visit";
import { testEach } from "support/methods";
import {
  accessProjectCard,
  accessTileCheckforSuspension,
  moAccessClaimCheckforMessaging,
  moAccessDocumentsCheckforMessaging,
  moAccessForecastsCheckforMessaging,
  moAccessPcrCheckReview,
  onHoldShouldNotExist,
  suspensionNotificationShouldNotExist,
} from "./steps";
import { Tile } from "typings/tiles";
const mo = "testman2@testing.com";

describe("On hold project > MO view.", () => {
  before(() => {
    visitApp({ asUser: mo, path: "projects/dashboard" });
  });

  it("Should display the project card for 569082 and access the project", () => accessProjectCard("874195"));

  it("Should not display an on hold warning message", () => {
    suspensionNotificationShouldNotExist();
    onHoldShouldNotExist();
  });

  it("Should access the Claims tile and the draft claim and check for messaging", () => {
    moAccessClaimCheckforMessaging(onHoldShouldNotExist);
    suspensionNotificationShouldNotExist();
  });

  it("Should access the Forecasts tile and Swindon University forecasts to check for messaging", () => {
    moAccessForecastsCheckforMessaging(onHoldShouldNotExist);
    suspensionNotificationShouldNotExist();
  });

  it("Should access the PCR tile and still be able to click Review on a submitted PCR.", () => {
    moAccessPcrCheckReview(onHoldShouldNotExist);
    suspensionNotificationShouldNotExist();
  });

  testEach(["Monitoring reports", "Project details"])(
    `Should access the "$0" tile and check for messaging`,
    (tile: Tile) => accessTileCheckforSuspension(tile, onHoldShouldNotExist),
  );

  it(`Should access the "Finance summary" tile and check that no messaging exists`, () => {
    cy.selectTile("Finance summary");
    cy.heading("Finance summary");
    onHoldShouldNotExist();
    suspensionNotificationShouldNotExist();
    cy.clickOn("Back to project overview");
    cy.heading("Project overview");
    onHoldShouldNotExist();
    suspensionNotificationShouldNotExist();
  });

  it(`Should access the "Documents" tile and check for messaging`, () => {
    moAccessDocumentsCheckforMessaging(onHoldShouldNotExist);
    suspensionNotificationShouldNotExist();
  });
});
