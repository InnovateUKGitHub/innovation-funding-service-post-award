// tslint:disable:no-identical-functions no-duplicate-string
import React from "react";
import Enzyme, { mount, shallow } from "enzyme";

import { DateTime, Settings } from "luxon";
import { ClaimWindow } from "../../../src/ui/components/claims/claimWindow";
import { TestBed } from "../helpers/TestBed";
import { findByQa } from "../helpers/find-by-qa";
import { text } from "body-parser";

describe("Claim Window", () => {

  const stubContent = {
    components: {
      claimWindow: {
        nextClaimPeriod: {content: "stub-nextClaimPeriod"},
        begins: {content: "stub-begins"},
        end: {content: "stub-ends"},
        daysOutstanding: {content: "stub-daysLeft"},
        deadline: {content: "stub-deadline"},
        daysOverdue: {content: "stub-daysPast"}
      }
    }
  };

  const setup = (props: any) => {
    const mountWrapper = mount(<TestBed content={stubContent as any}><ClaimWindow {...props} /></TestBed>);

    const headingElement = findByQa(mountWrapper, "claim-window-heading");
    const beginningPeriodElement = findByQa(mountWrapper, "claim-begins");
    const endPeriodElement = findByQa(mountWrapper, "claim-end");
    const daysLeftElement = findByQa(mountWrapper, "claim-daysLeft");
    const inPeriodDeadlineElement = findByQa(mountWrapper, "claim-inPeriod-deadline");
    const daysPastElement = findByQa(mountWrapper, "claim-daysPast");
    const overdueDeadlineElement = findByQa(mountWrapper, "claim-overdue-deadline");
    const numberOfDaysLeftElement = findByQa(mountWrapper, "number-of-days");
    const numberOfDaysOverdueElement = findByQa(mountWrapper, "days-overdue");

    return {
        mountWrapper,
        headingElement,
        beginningPeriodElement,
        endPeriodElement,
        daysLeftElement,
        inPeriodDeadlineElement,
        daysPastElement,
        overdueDeadlineElement,
        numberOfDaysLeftElement,
        numberOfDaysOverdueElement
    };
};

  describe("When not in claims window", () => {
    // period ends at end of this month
    const now = DateTime.local().setZone("Europe/London");
    const periodEndDate = now.set({ day: 1 }).plus({ months: 1 }).minus({ days: 1 });
    const periodEnd = periodEndDate.toJSDate();

    it("renders next claim period title", () => {
      const { headingElement } = setup({periodEnd});
      expect(headingElement.text()).toBe(stubContent.components.claimWindow.nextClaimPeriod.content);
    });

    it("renders claim window start date", () => {
      const { beginningPeriodElement } = setup({periodEnd});
      expect(beginningPeriodElement.text()).toContain(stubContent.components.claimWindow.begins.content);
    });

    it("renders claim window end date", () => {
      const { endPeriodElement } = setup({periodEnd});
      expect(endPeriodElement.text()).toContain(stubContent.components.claimWindow.end.content);
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
      const periodEnd = periodEndDate.toJSDate();

      it("renders number of days remaning in claim window", () => {
        const { numberOfDaysLeftElement } = setup({periodEnd});
        expect(numberOfDaysLeftElement.text()).toEqual(daysRemaining.toString());
      });

      it("renders message for days remaing", () => {
        const { daysLeftElement } = setup({periodEnd});
        expect(daysLeftElement.text()).toContain(stubContent.components.claimWindow.daysOutstanding.content);
      });

      it("renders claim window end date", () => {
        const { inPeriodDeadlineElement } = setup({periodEnd});
        expect(inPeriodDeadlineElement.text()).toContain(stubContent.components.claimWindow.deadline.content);
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
    const periodEnd = periodEndDate.toJSDate();

    it("renders number of days overdue in claim window", () => {
      const { numberOfDaysOverdueElement } = setup({periodEnd});
      expect(numberOfDaysOverdueElement.text()).toEqual(daysOverdue.toString());
    });

    it("renders message for days overdue", () => {
      const { daysPastElement } = setup({periodEnd});
      expect(daysPastElement.text()).toContain(stubContent.components.claimWindow.daysOverdue.content);
    });

    it("renders claim window end date", () => {
      const { overdueDeadlineElement } = setup({periodEnd});
      expect(overdueDeadlineElement.text()).toContain(stubContent.components.claimWindow.deadline.content);
    });
  });

  describe("When 1st day of claim window", () => {
    const periodEndDate = DateTime.fromString("2011/12/31", "yyyy/MM/dd");
    const periodEnd = periodEndDate.toJSDate();

    // set today to 1st of claim window
    beforeEach(() => Settings.now = () => Date.parse("2012/1/1"));
    // reset luxon
    afterEach(() => Settings.now = () => new Date().valueOf());

    it("renders 30 days remaning", () => {
      const { numberOfDaysLeftElement } = setup({periodEnd});
      expect(numberOfDaysLeftElement.text()).toEqual("30");
    });
  });

  describe("When 30th day of claim window", () => {
    const periodEndDate = DateTime.fromString("2011/12/31", "yyyy/MM/dd");
    const periodEnd = periodEndDate.toJSDate();

    // set today to 30th of claim window
    beforeEach(() => Settings.now = () => Date.parse("2012/1/30"));
    // reset luxon
    afterEach(() => Settings.now = () => new Date().valueOf());

    it("renders 1 days remaning", () => {
      const { numberOfDaysLeftElement } = setup({periodEnd});
      expect(numberOfDaysLeftElement.text()).toEqual("1");
    });
  });

  describe("When 31st day of claim window", () => {
    const periodEndDate = DateTime.fromString("2011/12/31", "yyyy/MM/dd");
    const periodEnd = periodEndDate.toJSDate();

    // set today 1 day after the 30th day from periodEndDate
    beforeEach(() => Settings.now = () => Date.parse("2012/1/31"));
    // reset luxon
    afterEach(() => Settings.now = () => new Date().valueOf());

    it("renders 1 day overdue", () => {
      const { numberOfDaysOverdueElement } = setup({periodEnd});
      expect(numberOfDaysOverdueElement.text()).toEqual("1");
    });
  });

  test("invalid periodEnd renders null", () => {
    const periodEnd = new Date("broken");
    const { mountWrapper } = setup({periodEnd});
    expect(mountWrapper.html()).toBeNull();
  });
});
