import { visitApp } from "common/visit";
import {
  capPotMessageDoesExist,
  capPotMessageNotExist,
  clearCostCatReturn,
  period2AbCad,
  saveAndReturnToPrepare,
  triggerCapPot,
} from "./steps";

const fcEmail = "contact77@test.co.uk";

describe("claims > Trigger Cap Pot Message", () => {
  before(() => {
    visitApp({ asUser: fcEmail, path: "projects/a0E2600000kSvOGEA0/overview" });
  });

  it("Should navigate to claims and open the Period 2 claim for AB Cad Services", period2AbCad);

  it(
    "Should not display any cap pot messaging until costs are added to tip the total value over the cap limit",
    capPotMessageNotExist,
  );

  it("Should enter costs value in the Labour category which will trigger the Cap Pot messaging", triggerCapPot);

  it("Should save and return to the first claims screen", saveAndReturnToPrepare);

  it("Should show validation messaging around the project cap", capPotMessageDoesExist);

  it("Should clear the cost category and navigate back to prepare screen", clearCostCatReturn);

  it("Should no longer display cap pot messaging as cost category has been deleted", capPotMessageNotExist);
});
