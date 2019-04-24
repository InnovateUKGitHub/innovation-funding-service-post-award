import "jest";
import { TestContext } from "../../testContextProvider";
import { GetAllLineItemsForClaimByCategoryQuery } from "@server/features/claimLineItems";
import { Authorisation, ProjectRole } from "@framework/types";

describe("GetAllLineItemsForClaimByCategoryQuery", () => {
  it("returns objects of correct shape", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();

    const testData = context.testData;
    const period = 1;
    const costCat = testData.createCostCategory();

    testData.createClaimLineItem({
      persist: true,
      costCategory: costCat,
      partner,
      periodId: period
    });

    testData.createClaim(partner, period);
    testData.createProfileTotalPeriod(partner, period);

    const query = new GetAllLineItemsForClaimByCategoryQuery(project.Id, partner.Id, costCat.Id, period);
    const result = await context.runQuery(query);
    const item = result[0];

    expect(result.length).toBe(1);
    expect(item.partnerId).toBe(partner.Id);
    expect(item.periodId).toBe(period);
  });

  it("returns an array of objects", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner();

    const testData = context.testData;
    const period = 1;
    const costCat = testData.createCostCategory();

    testData.createClaimLineItem({
      persist: true,
      costCategory: costCat,
      partner,
      periodId: period
    });

    testData.createClaimLineItem({
      persist: true,
      costCategory: costCat,
      partner,
      periodId: period
    });

    testData.createClaim(partner, period);
    testData.createProfileTotalPeriod(partner, period);

    const query = new GetAllLineItemsForClaimByCategoryQuery(project.Id, partner.Id, costCat.Id, period);
    const result = await context.runQuery(query);

    expect(result.length).toBe(2);
    expect(result[0].costCategoryId).toEqual(result[1].costCategoryId);
    expect(result[0].periodId).toEqual(result[1].periodId);
  });

  it("returns empty array if none found", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();

    const testData = context.testData;
    const period = 1;
    const costCat = testData.createCostCategory();

    const query = new GetAllLineItemsForClaimByCategoryQuery(project.Id, partner.Id, costCat.Id, period);
    const result = await context.runQuery(query);

    expect(result).toEqual([]);
  });

  test("accessControl - Project Monitoring officer passes", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const command = new GetAllLineItemsForClaimByCategoryQuery(project.Id, partner.Id, "", 1);
    const auth    = new Authorisation({
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
    const command = new GetAllLineItemsForClaimByCategoryQuery(project.Id, partner.Id, "", 1);
    const auth    = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.Unknown,
        partnerRoles: { [partner.Id]: ProjectRole.FinancialContact }
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(true);
  });

  test("accessControl - Partner Project Manager passes", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const command = new GetAllLineItemsForClaimByCategoryQuery(project.Id, partner.Id, "", 1);
    const auth    = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.Unknown,
        partnerRoles: { [partner.Id]: ProjectRole.ProjectManager }
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(true);
  });

  test("accessControl - all other roles fail", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const command = new GetAllLineItemsForClaimByCategoryQuery(project.Id, partner.Id, "", 1);
    const auth    = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.FinancialContact | ProjectRole.ProjectManager,
        partnerRoles: { [partner.Id]: ProjectRole.MonitoringOfficer }
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(false);
  });
});
