import "jest";
import { TestContext } from "../../testContextProvider";
import { GetClaimDetailsQuery } from "../../../../src/server/features/claimDetails";
import { DateTime } from "luxon";
import { throws } from "assert";
import { NotFoundError } from "../../../../src/server/features/common";

describe("GetClaimDetailsQuery", () => {
  it("returns single result", async () => {
    const context = new TestContext();
    const exectedCostCategoryId = "Expected_CostCategory_Id";
    const exectedParticipantId = "Expected_Participant_Id";
    const expectedId = "Expected_Id";
    const expectedPeriod = 3;
    const expectedValue = 2000;
    const expectedStartDate = DateTime.fromFormat("1 Dec 2014", "d MMM yyyy");
    const expectedEndDate = expectedStartDate.plus({ days: 30 });
    const expectedComments = "comments";

    const costCategory = context.testData.createCostCategory(x => {
      x.Id = exectedCostCategoryId;
    });

    const partner = context.testData.createPartner(undefined, x => {
      x.Id = exectedParticipantId;
    });

    context.testData.createClaimDetail(costCategory, partner, expectedPeriod, x => {
      x.Id = expectedId;
      x.Acc_ProjectPeriodStartDate__c = expectedStartDate.toFormat("yyyy-MM-dd");
      x.Acc_ProjectPeriodEndDate__c = expectedEndDate.toFormat("yyyy-MM-dd");
      x.Acc_PeriodCostCategoryTotal__c = expectedValue;
      x.Acc_ReasonForDifference__c = expectedComments;
    });

    const query = new GetClaimDetailsQuery(exectedParticipantId, expectedPeriod, exectedCostCategoryId);
    const result = await context.runQuery(query);

    expect(result).not.toBeNull();
    expect(result.costCategoryId).toEqual(exectedCostCategoryId);
    expect(result.periodStart).toEqual(expectedStartDate.toJSDate());
    expect(result.periodEnd).toEqual(expectedEndDate.toJSDate());
    expect(result.value).toEqual(expectedValue);
    expect(result.comments).toEqual(expectedComments);
  });

  // this needs revising once rollups are working
  // it may be best to expect exception reather than default item
  it("if not found returns default item", async () => {
    const context = new TestContext();

    const exectedCostCategoryId = "Expected_CostCategory_Id";
    const exectedParticipantId = "Expected_Participant_Id";
    const expectedPeriod = 3;
    const requestedPeriodId = expectedPeriod + 1;

    const query = new GetClaimDetailsQuery(exectedParticipantId, requestedPeriodId, exectedCostCategoryId);
    const result = await context.runQuery(query);

    expect(result).not.toBeNull();
    expect(result.costCategoryId).toEqual(exectedCostCategoryId);
    expect(result.value).toEqual(0);
    expect(result.periodId).toEqual(expectedPeriod + 1);
    expect(result.value).toEqual(0);
    expect(result.periodStart).toBeNull();
    expect(result.periodEnd).toBeNull();
    expect(result.comments).toBeNull();

  });
});
