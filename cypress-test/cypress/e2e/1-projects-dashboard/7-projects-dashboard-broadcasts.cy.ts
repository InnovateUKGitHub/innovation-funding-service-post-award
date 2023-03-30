import { visitApp } from "common/visit";
import {
  shouldDisplayTwoProjectCards,
  shouldNavigateToProjectDashboard,
  hasBroadcast,
  accessBroadCastMessageAndAssert,
  backToDashboard,
} from "./steps";

describe("projects dashboard > Broadcast message", () => {
  before(() => {
    visitApp({});
  });

  it("displays two cards", shouldDisplayTwoProjectCards);

  it('should navigate to project dashboard when the "Projects" card is selected', shouldNavigateToProjectDashboard);

  it("Should include a broadcast message a the top of the page", hasBroadcast);

  it("Should follow the link to access the full broadcast information", accessBroadCastMessageAndAssert);

  it("Should follow the back link to the previous page", backToDashboard);
});
