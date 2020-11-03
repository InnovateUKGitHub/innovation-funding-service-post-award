
import { DateTime } from "luxon";
import { TestContext } from "../../testContextProvider";
import { GetClaimDetailsQuery } from "../../../../src/server/features/claimDetails";
import { Authorisation, ProjectRole } from "@framework/types";

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

    const costCategory = context.testData.createCostCategory({ id: exectedCostCategoryId });
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(undefined, x => {
      x.id = exectedParticipantId;
    });

    context.testData.createClaimDetail(project, costCategory, partner, expectedPeriod, x => {
      x.Id = expectedId;
      x.Acc_ProjectPeriodStartDate__c = expectedStartDate.toFormat("yyyy-MM-dd");
      x.Acc_ProjectPeriodEndDate__c = expectedEndDate.toFormat("yyyy-MM-dd");
      x.Acc_PeriodCostCategoryTotal__c = expectedValue;
      x.Acc_ReasonForDifference__c = expectedComments;
    });

    const query = new GetClaimDetailsQuery(partner.projectId, exectedParticipantId, expectedPeriod, exectedCostCategoryId);
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

    const query = new GetClaimDetailsQuery("", exectedParticipantId, requestedPeriodId, exectedCostCategoryId);
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

  describe("Line Items", () => {
    it("returns objects of correct shape", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();

      const testData = context.testData;
      const period = 1;
      const costCat = testData.createCostCategory();
      testData.createClaimDetail(project, costCat, partner);

      const lastModified = new Date();
      testData.createClaimLineItem(costCat, partner, period, x => {
        x.LastModifiedDate = lastModified.toISOString();
        x.Acc_LineItemCost__c = 5;
        x.Acc_LineItemDescription__c = "A cost";
      });

      const query = new GetClaimDetailsQuery(project.Id, partner.id, period, costCat.id);
      const result = await context.runQuery(query);
      const item = result.lineItems[0];

      expect(result.lineItems.length).toBe(1);
      expect(item.partnerId).toBe(partner.id);
      expect(item.periodId).toBe(period);
      expect(item.lastModifiedDate).toEqual(lastModified);
      expect(item.description).toEqual("A cost");
      expect(item.value).toEqual(5);
    });

    it("returns an array of objects", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner();

      const testData = context.testData;
      const period = 1;
      const costCat = testData.createCostCategory();
      testData.createClaimDetail(project, costCat, partner);

      testData.createClaimLineItem(costCat, partner, period);

      testData.createClaimLineItem(costCat, partner, period);

      testData.createClaim(partner, period);
      testData.createProfileTotalPeriod(partner, period);

      const query = new GetClaimDetailsQuery(project.Id, partner.id, period, costCat.id);
      const result = await context.runQuery(query);

      expect(result.lineItems.length).toBe(2);
      expect(result.lineItems[0].costCategoryId).toEqual(result.lineItems[1].costCategoryId);
      expect(result.lineItems[0].periodId).toEqual(result.lineItems[1].periodId);
    });

    it("returns empty array if none found", async () => {
      const context = new TestContext();
      const project = context.testData.createPartner();
      const partner = context.testData.createPartner();

      const testData = context.testData;
      const period = 1;
      const costCat = testData.createCostCategory();

      const query = new GetClaimDetailsQuery(project.id, partner.id, period, costCat.id);
      const result = await context.runQuery(query);

      expect(result.lineItems).toEqual([]);
    });

    test("accessControl - Project Monitoring officer passes", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const command = new GetClaimDetailsQuery(project.Id, partner.id, 1, "");
      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.MonitoringOfficer,
          partnerRoles: {}
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("accessControl - Partner Finance contact passes", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const command = new GetClaimDetailsQuery(project.Id, partner.id, 1, "");
      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.Unknown,
          partnerRoles: { [partner.id]: ProjectRole.FinancialContact }
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("accessControl - Partner Project Manager passes", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const command = new GetClaimDetailsQuery(project.Id, partner.id, 1, "");
      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.Unknown,
          partnerRoles: { [partner.id]: ProjectRole.ProjectManager }
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(true);
    });

    test("accessControl - all other roles fail", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const partner = context.testData.createPartner();
      const command = new GetClaimDetailsQuery(project.Id, partner.id, 1, "");
      const auth = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.FinancialContact | ProjectRole.ProjectManager,
          partnerRoles: { [partner.id]: ProjectRole.MonitoringOfficer }
        }
      });

      expect(await context.runAccessControl(auth, command)).toBe(false);
    });
  });
});
