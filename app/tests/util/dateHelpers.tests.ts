// tslint:disable:no-duplicate-string no-identical-functions
import "jest";
import { ClaimFrequency, ProjectDto } from "@framework/dtos";
import { periodInProject } from "@framework/util";

describe("periodInProject", () => {
  describe("Monthly claim frequency", () => {
    it("should return correct period when given date is beginning of period", () => {
      const project = {
        claimFrequency: ClaimFrequency.Monthly,
        startDate: new Date("1 January 2019")
      } as ProjectDto;

      expect(periodInProject(new Date("1 July 2019"), project)).toBe(7);
    });

    it("should return correct period when given date is end of period", () => {
      const project = {
        claimFrequency: ClaimFrequency.Monthly,
        startDate: new Date("1 January 2019")
      } as ProjectDto;

      expect(periodInProject(new Date("31 July 2019"), project)).toBe(7);
    });
  });

  describe("Quarterly claim frequency", () => {
    it("should return correct period when given date is beginning of period", () => {
      const project = {
        claimFrequency: ClaimFrequency.Quarterly,
        startDate: new Date("1 January 2019")
      } as ProjectDto;

      expect(periodInProject(new Date("1 July 2019"), project)).toBe(3);
    });

    it("should return correct period when given date is end of period", () => {
      const project = {
        claimFrequency: ClaimFrequency.Quarterly,
        startDate: new Date("1 January 2019")
      } as ProjectDto;

      expect(periodInProject(new Date("30 September 2019"), project)).toBe(3);
    });
  });

  describe("Time zones", () => {
    it("should work for end of Greenwich Mean Time", () => {
      const project = {
        claimFrequency: ClaimFrequency.Monthly,
        startDate: new Date("1 January 2019")
      } as ProjectDto;

      expect(periodInProject(new Date("31 March 2019 00:00:00 GMT"), project)).toBe(3);
    });

    it("should work for start of British Summer Time", () => {
      const project = {
        claimFrequency: ClaimFrequency.Monthly,
        startDate: new Date("1 January 2019")
      } as ProjectDto;

      expect(periodInProject(new Date("31 March 2019 01:00:00 GMT+01:00"), project)).toBe(3);
    });

    it("should work for end of British Summer Time", () => {
      const project = {
        claimFrequency: ClaimFrequency.Monthly,
        startDate: new Date("1 January 2010")
      } as ProjectDto;

      expect(periodInProject(new Date("31 October 2010 01:00:00 GMT+01:00"), project)).toBe(10);
    });

    it("should work for start of Greenwich Mean Time", () => {
      const project = {
        claimFrequency: ClaimFrequency.Monthly,
        startDate: new Date("1 January 2010")
      } as ProjectDto;

      expect(periodInProject(new Date("31 October 2010 02:00:00 GMT"), project)).toBe(10);
    });
  });
});
