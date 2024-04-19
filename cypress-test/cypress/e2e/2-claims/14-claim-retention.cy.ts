import { visitApp } from "common/visit";
import {
  capPotMessageDoesExist,
  capPotMessageNotExist,
  clearCostCatReturn,
  period2AbCad,
  reduceToBelowCapLimit,
  triggerCapPot,
} from "./steps";
import { retentionTidyUp } from "common/costCleanUp";

const fcEmail = "contact77@test.co.uk";

describe("claims > Trigger Cap Pot Message", () => {
  before(() => {
    visitApp({ asUser: fcEmail, path: "projects/a0E2600000kSvOGEA0/overview" });
  });

  it("Should navigate to claims and open the Period 2 claim for AB Cad Services", period2AbCad);

  it("Should clear the cost categories first to ensure the claim is in the correct state", () => retentionTidyUp());

  it(
    "Should not display any cap pot messaging until costs are added to tip the total value over the cap limit",
    capPotMessageNotExist,
  );

  it(
    "Should enter costs value in the Labour, Materials and Subcontracting category which will trigger the Cap Pot messaging",
    triggerCapPot,
  );

  it("Should show validation messaging around the project cap", capPotMessageDoesExist);

  it(
    "Should go in and reduce the value to just below the 90% cap limit and remove the retention message",
    reduceToBelowCapLimit,
  );

  it(
    "Should not display any cap pot messaging until costs are added to tip the total value over the cap limit",
    capPotMessageNotExist,
  );

  it("Should clear the cost category and navigate back to prepare screen", clearCostCatReturn);

  it("Should no longer display cap pot messaging as cost category has been deleted", capPotMessageNotExist);
});
