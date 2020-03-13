import "jest";
import { DateTime } from "luxon";
import { TestContext } from "../../testContextProvider";
import { GetClaim } from "@server/features/claims";
import { SALESFORCE_DATE_FORMAT } from "@server/features/common";
import { ClaimStatus } from "@framework/types";
// tslint:disable: no-big-function
describe("GetClaim", () => {
  it("returns correct claim values", async () => {
    const context  = new TestContext();
    const partner  = context.testData.createPartner();
    const testData = context.testData;
    const period1  = 1;

    testData.createProfileTotalPeriod(partner, period1);
    const claim  = testData.createClaim(partner, period1);
    const query  = new GetClaim(partner.Id, period1);
    const result = await context.runQuery(query);

    expect(result.id).toBe(claim.Id);
    expect(result.partnerId).toBe(claim.Acc_ProjectParticipant__r.Id);
    expect(result.status).toBe(claim.Acc_ClaimStatus__c);
    expect(result.statusLabel).toBe(claim.ClaimStatusLabel);
    expect(result.periodId).toBe(claim.Acc_ProjectPeriodNumber__c);
    expect(result.totalCost).toBe(claim.Acc_ProjectPeriodCost__c);
    expect(result.approvedDate).toBeNull();
    expect(result.paidDate).toBeNull();
    expect(result.comments).toBe(claim.Acc_ReasonForDifference__c);
    expect(result.isIarRequired).toBe(claim.Acc_IARRequired__c);
    expect(result.isApproved).toBe(false);
    expect(result.overheadRate).toBe(claim.Acc_ProjectParticipant__r.Acc_OverheadRate__c);
    expect(result.periodStartDate).toEqual(context.clock.parse(claim.Acc_ProjectPeriodStartDate__c, SALESFORCE_DATE_FORMAT));
    expect(result.periodEndDate).toEqual(context.clock.parse(claim.Acc_ProjectPeriodEndDate__c, SALESFORCE_DATE_FORMAT));
    expect(result.isFinalClaim).toBe(claim.Acc_FinalClaim__c);
  });

  it("calculates correct lastModifiedDate", async () => {
    const context  = new TestContext();
    const partner  = context.testData.createPartner();
    const testData = context.testData;
    const period   = 1;
    const lastModifiedISO  = "2018-02-21T12:00:00.000+00";
    const lastModifiedDate = DateTime.fromISO(lastModifiedISO).toJSDate();

    testData.createProfileTotalPeriod(partner, period);
    testData.createClaim(partner, period, x => x.LastModifiedDate = lastModifiedISO);
    const query  = new GetClaim(partner.Id, period);
    const result = await context.runQuery(query);

    expect(result.lastModifiedDate).toEqual(lastModifiedDate);
  });

  it("calculates correct approvedDate", async () => {
    const context  = new TestContext();
    const partner  = context.testData.createPartner();
    const testData = context.testData;
    const period   = 1;

    testData.createProfileTotalPeriod(partner, period);
    const claim  = testData.createClaim(partner, period, x => x.Acc_ApprovedDate__c = "2018-02-21");
    const query  = new GetClaim(partner.Id, period);
    const result = await context.runQuery(query);

    expect(result.approvedDate).toEqual(context.clock.parse(claim.Acc_ApprovedDate__c!, SALESFORCE_DATE_FORMAT));
  });

  it("calculates correct paidDate", async () => {
    const context  = new TestContext();
    const partner  = context.testData.createPartner();
    const testData = context.testData;
    const period   = 1;

    testData.createProfileTotalPeriod(partner, period);
    const claim  = testData.createClaim(partner, period, x => x.Acc_PaidDate__c = "2018-02-21");
    const query  = new GetClaim(partner.Id, period);
    const result = await context.runQuery(query);

    expect(result.paidDate).toEqual(context.clock.parse(claim.Acc_PaidDate__c!, SALESFORCE_DATE_FORMAT));
  });

  it("calculates isApproved true if ClaimStatus is Approved", async () => {
    const context  = new TestContext();
    const partner  = context.testData.createPartner();
    const testData = context.testData;
    const period   = 1;

    testData.createProfileTotalPeriod(partner, period);
    testData.createClaim(partner, period, x => x.Acc_ClaimStatus__c = ClaimStatus.APPROVED);
    const query  = new GetClaim(partner.Id, period);
    const result = await context.runQuery(query);

    expect(result.isApproved).toBe(true);
  });

  it("calculates isApproved true if ClaimStatus is Paid", async () => {
    const context  = new TestContext();
    const partner  = context.testData.createPartner();
    const testData = context.testData;
    const period   = 1;

    testData.createProfileTotalPeriod(partner, period);
    testData.createClaim(partner, period, x => x.Acc_ClaimStatus__c = ClaimStatus.PAID);
    const query  = new GetClaim(partner.Id, period);
    const result = await context.runQuery(query);

    expect(result.isApproved).toBe(true);
  });

  it("calculates allowIarEdit true if ClaimStatus is Draft", async () => {
    const context  = new TestContext();
    const partner  = context.testData.createPartner();
    const testData = context.testData;
    const period   = 1;

    testData.createProfileTotalPeriod(partner, period);
    testData.createClaim(partner, period, x => x.Acc_ClaimStatus__c = ClaimStatus.DRAFT);
    const query  = new GetClaim(partner.Id, period);
    const result = await context.runQuery(query);

    expect(result.allowIarEdit).toBe(true);
  });

  it("calculates allowIarEdit true if ClaimStatus is Submitted", async () => {
    const context  = new TestContext();
    const partner  = context.testData.createPartner();
    const testData = context.testData;
    const period   = 1;

    testData.createProfileTotalPeriod(partner, period);
    testData.createClaim(partner, period, x => x.Acc_ClaimStatus__c = ClaimStatus.SUBMITTED);
    const query  = new GetClaim(partner.Id, period);
    const result = await context.runQuery(query);

    expect(result.allowIarEdit).toBe(true);
  });

  it("calculates allowIarEdit true if ClaimStatus is MO Queried", async () => {
    const context  = new TestContext();
    const partner  = context.testData.createPartner();
    const testData = context.testData;
    const period   = 1;

    testData.createProfileTotalPeriod(partner, period);
    testData.createClaim(partner, period, x => x.Acc_ClaimStatus__c = ClaimStatus.MO_QUERIED);
    const query  = new GetClaim(partner.Id, period);
    const result = await context.runQuery(query);

    expect(result.allowIarEdit).toBe(true);
  });

  it("calculates allowIarEdit true if ClaimStatus is Awaiting IAR", async () => {
    const context  = new TestContext();
    const partner  = context.testData.createPartner();
    const testData = context.testData;
    const period   = 1;

    testData.createProfileTotalPeriod(partner, period);
    testData.createClaim(partner, period, x => x.Acc_ClaimStatus__c = ClaimStatus.AWAITING_IAR);
    const query  = new GetClaim(partner.Id, period);
    const result = await context.runQuery(query);

    expect(result.allowIarEdit).toBe(true);
  });

  it("calculates allowIarEdit true if ClaimStatus is Innovate Queried", async () => {
    const context  = new TestContext();
    const partner  = context.testData.createPartner();
    const testData = context.testData;
    const period   = 1;

    testData.createProfileTotalPeriod(partner, period);
    testData.createClaim(partner, period, x => x.Acc_ClaimStatus__c = ClaimStatus.INNOVATE_QUERIED);
    const query  = new GetClaim(partner.Id, period);
    const result = await context.runQuery(query);

    expect(result.allowIarEdit).toBe(true);
  });

  it("calculates allowIarEdit false if ClaimStatus is alternative", async () => {
    const context  = new TestContext();
    const partner  = context.testData.createPartner();
    const testData = context.testData;
    const period   = 1;

    testData.createProfileTotalPeriod(partner, period);
    testData.createClaim(partner, period, x => x.Acc_ClaimStatus__c = ClaimStatus.UNKNOWN);
    const query  = new GetClaim(partner.Id, period);
    const result = await context.runQuery(query);

    expect(result.allowIarEdit).toBe(false);
  });

  it("maps forecastCost from forecast PeriodLatestForecastCost", async () => {
    const context  = new TestContext();
    const partner  = context.testData.createPartner();
    const testData = context.testData;
    const period   = 1;

    testData.createClaim(partner, period);
    const forecast = testData.createProfileTotalPeriod(partner, period);
    const query    = new GetClaim(partner.Id, period);
    const result   = await context.runQuery(query);

    expect(result.forecastCost).toEqual(forecast.Acc_PeriodLatestForecastCost__c);
  });

  it("maps forecastCost to 0 if forecast PeriodLatestForecastCost is falsy", async () => {
    const context  = new TestContext();
    const partner  = context.testData.createPartner();
    const testData = context.testData;
    const period   = 1;

    testData.createClaim(partner, period);
    testData.createProfileTotalPeriod(partner, period, x => x.Acc_PeriodLatestForecastCost__c = null!);
    const query  = new GetClaim(partner.Id, period);
    const result = await context.runQuery(query);

    expect(result.forecastCost).toEqual(0);
  });
});
