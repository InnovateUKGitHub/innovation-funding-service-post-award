import { visitApp } from "common/visit";
import { testEach } from "support/methods";
import {
  accessProjectCard,
  accessTileCheckforSuspension,
  moAccessClaimCheckforMessaging,
  moAccessDocumentsCheckforMessaging,
  moAccessForecastsCheckforMessaging,
  moAccessPcrCheckReview,
  onHoldMessage,
} from "./steps";
import { Tile } from "typings/tiles";
const mo = "testman2@testing.com";

describe("On hold project > MO view.", () => {
  before(() => {
    visitApp({ asUser: mo, path: "projects/dashboard" });
  });

  it("Should display the project card for 569082 and access the project", () => accessProjectCard("874195"));

  it("Should display an on hold warning message", () => {
    onHoldMessage();
    cy.getByAriaLabel("alert message").should("not.exist");
  });

  it("Should access the Claims tile and the draft claim and check for messaging", () =>
    moAccessClaimCheckforMessaging(onHoldMessage));

  it("Should access the Forecasts tile and Swindon University forecasts to check for messaging", () =>
    moAccessForecastsCheckforMessaging(onHoldMessage));

  it("Should access the PCR tile and still be able to click Review on a submitted PCR.", () =>
    moAccessPcrCheckReview(onHoldMessage));

  testEach(["Monitoring reports", "Project details", "Finance summary"])(
    `Should access the "$0" tile and check for messaging`,
    (tile: Tile) => accessTileCheckforSuspension(tile, onHoldMessage),
  );

  it(`Should access the "Documents" tile and check for messaging`, () =>
    moAccessDocumentsCheckforMessaging(onHoldMessage));
});
