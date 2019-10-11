// tslint:disable:no-identical-functions no-duplicate-string
import "jest";
import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { DateTime, Settings } from "luxon";
import { ClaimWindow } from "../../../src/ui/components/claims/claimWindow";

Enzyme.configure({ adapter: new Adapter() });

describe("Claim Window", () => {

  describe("When not in claims window", () => {
    // period ends at end of this month
    const now = DateTime.local().setZone("Europe/London");
    const periodEndDate = now.set({ day: 1 }).plus({ months: 1 }).minus({ days: 1 });
    const windowStartDate = periodEndDate.plus({ days: 1 }).set({ hour: 0, minute: 0, second: 0 });
    const windowEndDate = periodEndDate.plus({ days: 30 }).set({ hour: 0, minute: 0, second: 0 });

    it("renders next claim period title", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()} />).find("p").first().text();
      expect(output).toBe("Next claim period");
    });

    it("renders claim window start date", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()} />).text();
      expect(output).toContain(`Begins ${windowStartDate.toFormat("d MMM yyyy")}`);
    });

    it("renders claim window end date", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()} />).text();
      expect(output).toContain(`Ends ${windowEndDate.toFormat("d MMM yyyy")}`);
    });
  });

  describe("When in claims window", () => {
    // don't run these tests on the 31st as they don't apply as you are not in claim window
    // 31st of a month is tested explicitly later
    const now = DateTime.local().setZone("Europe/London");
    if (now.day !== 31) {
      // period ends at end of last month
      const periodEndDate = now.set({ day: 1 }).set({ hour: 0, minute: 0, second: 0 }).minus({ days: 1 });
      const windowEndDate = periodEndDate.plus({ days: 30 });
      const daysRemaining = Math.ceil(windowEndDate.diff(now, "days").days) + 1;

      it("renders number of days remaning in claim window", () => {
        const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()} />).find("p").first().text();
        expect(output).toEqual(daysRemaining.toString());
      });

      it("renders message for days remaing", () => {
        const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()} />).text();
        expect(output).toContain(`days left of claim period`);
      });

      it("renders claim window end date", () => {
        const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()} />).text();
        expect(output).toContain(`deadline ${windowEndDate.toFormat("d MMM yyyy")}`);
      });
    }
  });

  describe("When overdue", () => {
    // period ends at 3 months ago
    const now = DateTime.local().setZone("Europe/London");
    const periodStartDate = now.set({ day: 1, hour: 0, minute: 0, second: 0 }).minus({ months: 3 });
    const periodEndDate = periodStartDate.plus({ months: 1, days: -1 });
    const windowEndDate = periodEndDate.plus({ days: 30 });
    const daysOverdue = Math.floor(now.diff(windowEndDate, "days").days);

    it("renders number of days overdue in claim window", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()} />).find("p").first().text();
      expect(output).toEqual(daysOverdue.toString());
    });

    it("renders message for days overdue", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()} />).text();
      expect(output).toContain(`days past claim period`);
    });

    it("renders claim window end date", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()} />).text();
      expect(output).toContain(`deadline ${windowEndDate.toFormat("d MMM yyyy")}`);
    });
  });

  describe("When 1st day of claim window", () => {
    const periodEndDate = DateTime.fromString("2011/12/31", "yyyy/MM/dd");

    // set today to 1st of claim window
    beforeEach(() => Settings.now = () => Date.parse("2012/1/1"));
    // reset luxon
    afterEach(() => Settings.now = () => new Date().valueOf());

    it("renders 30 days remaning", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()} />).find("p").first().text();
      expect(output).toEqual("30");
    });
  });

  describe("When 30th day of claim window", () => {
    const periodEndDate = DateTime.fromString("2011/12/31", "yyyy/MM/dd");

    // set today to 30th of claim window
    beforeEach(() => Settings.now = () => Date.parse("2012/1/30"));
    // reset luxon
    afterEach(() => Settings.now = () => new Date().valueOf());

    it("renders 1 days remaning", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()} />).find("p").first().text();
      expect(output).toEqual("1");
    });
  });

  describe("When 31st day of claim window", () => {
    const periodEndDate = DateTime.fromString("2011/12/31", "yyyy/MM/dd");

    // set today to 30th of claim window
    beforeEach(() => Settings.now = () => Date.parse("2012/1/30"));
    // reset luxon
    afterEach(() => Settings.now = () => new Date().valueOf());

    it("renders 1 day overdue", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()} />).find("p").first().text();
      expect(output).toEqual("1");
    });
  });

  test("invalid periodEnd renders null", () => {
    const periodEnd = new Date("broken");
    const output = Enzyme.mount(<ClaimWindow periodEnd={periodEnd} />);
    expect(output.html()).toBeNull();
  });
});
