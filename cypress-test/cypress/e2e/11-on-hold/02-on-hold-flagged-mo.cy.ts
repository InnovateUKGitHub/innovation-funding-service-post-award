import { visitApp } from "common/visit";
import {
  accessProjectCard,
  accessTileCheckforSuspension,
  moAccessClaimCheckforMessaging,
  moAccessDocumentsCheckforMessaging,
  moAccessForecastsCheckforMessaging,
  moAccessPcrCheckReview,
  moOnHoldShouldNotExist,
  moSuspensionNotification,
  onHoldShouldNotExist,
} from "./steps";
import { testEach } from "support/methods";
import { Tile } from "typings/tiles";
const mo = "testman2@testing.com";

describe("On hold project > Flagged participant > MO view.", () => {
  before(() => {
    visitApp({ asUser: mo, path: "projects/dashboard" });
  });

  it("Should display the correct project card and access the project", () => accessProjectCard("569082"));

  it("Should display suspension notification details", () => {
    moSuspensionNotification();
    moOnHoldShouldNotExist();
  });

  it("Should access the Claims tile and the draft claim and check for messaging", () => {
    moAccessClaimCheckforMessaging(moSuspensionNotification);
    moOnHoldShouldNotExist();
  });

  it("Should access the Forecasts tile and Swindon University forecasts to check for messaging", () => {
    moAccessForecastsCheckforMessaging(moSuspensionNotification);
    moOnHoldShouldNotExist();
  });

  it("Should access the PCR tile and still be able to click Review on a submitted PCR.", () => {
    moAccessPcrCheckReview(moSuspensionNotification);
    moOnHoldShouldNotExist();
  });

  testEach(["Monitoring reports", "Project details", "Finance summary"])(
    `Should access the "$0" tile and check for messaging`,
    (tile: Tile) => accessTileCheckforSuspension(tile, moSuspensionNotification),
  );

  it(`Should access the "Documents" tile and check for messaging`, () => {
    moAccessDocumentsCheckforMessaging(moSuspensionNotification);
    moOnHoldShouldNotExist();
  });
});
