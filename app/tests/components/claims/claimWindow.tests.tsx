import "jest";
import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { DateTime, Settings } from "luxon";
import { ClaimWindow } from "../../../src/ui/components/claims";
import { notEqual } from "assert";

Enzyme.configure({ adapter: new Adapter() });

describe("Claim Window", () => {
  
  describe("When not in claims window", () => {
    // period ends at end of this month 
    const periodEndDate = DateTime.local().set({day:1}).plus({months:1}).minus({days: 1});
    const windowStartDate = periodEndDate.plus({days:1}).set({hour: 0, minute:0, second:0});
    const windowEndDate = periodEndDate.plus({days:30}).set({hour: 0, minute:0, second:0});

    it("renders next claim period title", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()}/>).find("h3").text();
      expect(output).toBe("Next claim period");
    });

    it("renders claim window start date", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()}/>).text();
      expect(output).toContain(`Begins ${windowStartDate.toFormat("d MMMM yyyy")}`);
    });

    it("renders claim window end date", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()}/>).text();
      expect(output).toContain(`Ends ${windowEndDate.toFormat("d MMMM yyyy")}`);
    });
  });

  describe("When in claims window", () => {
    // period ends at end of last month 
    const periodEndDate = DateTime.local().set({day:1}).minus({days: 1});
    const windowEndDate = periodEndDate.plus({days:30}).set({hour: 0, minute:0, second:0});
    const daysRemaining = Math.ceil(windowEndDate.diff(DateTime.local(), "days").days) + 1; 

    it("renders number of days remaning in claim window", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()}/>).find("h3").text();
      expect(output).toEqual(daysRemaining.toString());
    });

    it("renders message for days remaing", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()}/>).text();
      expect(output).toContain(`days left of claim period`);
    });

    it("renders claim window end date", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()}/>).text();
      expect(output).toContain(`deadline ${windowEndDate.toFormat("d MMMM yyyy")}`);
    });
  });

  describe("When overdue", () => {
    // period ends at 2 months ago 
    const periodEndDate = DateTime.local().minus({ months: 1, days: 1});
    const windowEndDate = periodEndDate.plus({days:30}).set({hour: 0, minute:0, second:0});
    const daysOverdue = Math.floor(DateTime.local().diff(windowEndDate, "days").days); 

    it("renders number of days overdue in claim window", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()}/>).find("h3").text();
      expect(output).toEqual(daysOverdue.toString());
    });

    it("renders message for days overdue", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()}/>).text();
      expect(output).toContain(`days past claim period`);
    });

    it("renders claim window end date", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()}/>).text();
      expect(output).toContain(`deadline ${windowEndDate.toFormat("d MMMM yyyy")}`);
    });
  });

  describe("When 1st day of claim window", () => {
    const periodEndDate = DateTime.fromString("2011/12/31", "yyyy/MM/dd");
    
    // set today to 1st of claim window 
    beforeEach(() => Settings.now = () => Date.parse("2012/1/1"));
    // reset luxon
    afterEach(() => Settings.now = () => new Date().valueOf());

    it("renders 30 days remaning", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()}/>).find("h3").text();
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
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()}/>).find("h3").text();
      expect(output).toEqual("1");
    });
  });

  describe("When 31th day of claim window", () => {
    const periodEndDate = DateTime.fromString("2011/12/31", "yyyy/MM/dd");
    
    // set today to 30th of claim window 
    beforeEach(() => Settings.now = () => Date.parse("2012/1/30"));
    // reset luxon
    afterEach(() => Settings.now = () => new Date().valueOf());

    it("renders 1 day overdue", () => {
      const output = Enzyme.mount(<ClaimWindow periodEnd={periodEndDate.toJSDate()}/>).find("h3").text();
      expect(output).toEqual("1");
    });
  });
});
