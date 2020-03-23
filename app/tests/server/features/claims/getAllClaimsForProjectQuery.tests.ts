import "jest";
import { TestContext } from "../../testContextProvider";
import { GetAllClaimsForProjectQuery } from "@server/features/claims";
import { ClaimStatus } from "@framework/types";

describe("getAllClaimsForProjectQuery", () => {
  it("returns the full claim details", async () => {
    const context = new TestContext();
    const expectedClaimCost = 10000;
    const expectedForcastCost = 20000;
    const expectedPeriodId = 2;

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);

    context.testData.createClaim(partner, expectedPeriodId, x => {
      x.Acc_ProjectPeriodCost__c = expectedClaimCost;
      x.Acc_ClaimStatus__c = ClaimStatus.INNOVATE_QUERIED;
    });

    context.testData.createProfileTotalPeriod(partner, expectedPeriodId, x => {
      x.Acc_PeriodLatestForecastCost__c = expectedForcastCost;
    });

    const query = new GetAllClaimsForProjectQuery(project.Id);
    const result = await context.runQuery(query);
    const item = result[0];

    expect(item.totalCost).toBe(expectedClaimCost);
    expect(item.forecastCost).toBe(expectedForcastCost);
    expect(item.partnerId).toBe(partner.id);
    expect(item.status).toBe("Innovate Queried");
    expect(item.periodId).toBe(expectedPeriodId);
  });

  it("returns all claims for a partner", async () => {
    const context = new TestContext();
    const expectedNumberOfCLaims = 3;
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);

    context.testData.range(expectedNumberOfCLaims, i => {
      context.testData.createClaim(partner, i, x => {
        x.Acc_ProjectPeriodCost__c = i * 10;
        x.Acc_ClaimStatus__c = ClaimStatus.INNOVATE_QUERIED;
      });
      context.testData.createProfileTotalPeriod(partner, i, x => {
        x.Acc_PeriodLatestForecastCost__c = i * 100;
      });
    });

    const query = new GetAllClaimsForProjectQuery(project.Id);
    const results = await context.runQuery(query);

    expect(results.length).toBe(3);
    expect(results.map(x => x.periodId)).toEqual([3, 2, 1]);
    expect(results.map(x => x.partnerId)).toEqual([partner.id, partner.id, partner.id]);
    expect(results.map(x => x.totalCost)).toEqual([30, 20, 10]);
    expect(results.map(x => x.forecastCost)).toEqual([300, 200, 100]);
  });

  it("returns all claims for all partners", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner1 = context.testData.createPartner(project);
    const partner2 = context.testData.createPartner(project);

    context.testData.createClaim(partner1, 1, x => {
      x.Acc_ProjectPeriodCost__c = 10;
      x.Acc_ClaimStatus__c = ClaimStatus.INNOVATE_QUERIED;
    });

    context.testData.createClaim(partner2, 1, x => {
      x.Acc_ProjectPeriodCost__c = 20;
      x.Acc_ClaimStatus__c = ClaimStatus.APPROVED;
    });

    context.testData.createProfileTotalPeriod(partner1, 1, x => {
      x.Acc_PeriodLatestForecastCost__c = 100;
    });

    context.testData.createProfileTotalPeriod(partner2, 1, x => {
      x.Acc_PeriodLatestForecastCost__c = 200;
    });

    const query = new GetAllClaimsForProjectQuery(project.Id);
    const results = await context.runQuery(query);

    expect(results.length).toBe(2);
    expect(results.map(x => x.periodId)).toEqual([1, 1]);
    expect(results.map(x => x.partnerId)).toEqual([partner1.id, partner2.id]);
    expect(results.map(x => x.totalCost)).toEqual([10, 20]);
    expect(results.map(x => x.forecastCost)).toEqual([100, 200]);
  });

  it("returns only claims for project", async () => {
    const context = new TestContext();

    const project1 = context.testData.createProject();
    const project2 = context.testData.createProject();

    const partner1 = context.testData.createPartner(project1);
    const partner2 = context.testData.createPartner(project2);

    context.testData.createClaim(partner1, 1, x => {
      x.Acc_ProjectPeriodCost__c = 10;
      x.Acc_ClaimStatus__c = ClaimStatus.INNOVATE_QUERIED;
    });

    context.testData.createClaim(partner2, 1, x => {
      x.Acc_ProjectPeriodCost__c = 20;
      x.Acc_ClaimStatus__c = ClaimStatus.APPROVED;
    });

    context.testData.createProfileTotalPeriod(partner1, 1, x => {
      x.Acc_PeriodLatestForecastCost__c = 100;
    });

    context.testData.createProfileTotalPeriod(partner2, 1, x => {
      x.Acc_PeriodLatestForecastCost__c = 200;
    });

    const query = new GetAllClaimsForProjectQuery(project2.Id);
    const results = await context.runQuery(query);

    expect(results.length).toBe(1);
    expect(results.map(x => x.periodId)).toEqual([1]);
    expect(results.map(x => x.partnerId)).toEqual([partner2.id]);
    expect(results.map(x => x.totalCost)).toEqual([20]);
    expect(results.map(x => x.forecastCost)).toEqual([200]);
  });

  it("sorts project lead first then alphabetical", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();

    const partner1 = context.testData.createPartner(project, p => {
      p.projectRole = "";
      p.name = "XXXXXX";
    });
    const partner2 = context.testData.createPartner(project, p => {
      p.projectRole = "Lead";
      p.name = "ZZZZZZZZ";
    });
    const partner3 = context.testData.createPartner(project, p => {
      p.projectRole = "";
      p.name = "AAAAAA";
    });

    context.testData.createClaim(partner1, 1);
    context.testData.createClaim(partner2, 1);
    context.testData.createClaim(partner3, 1);

    const query = new GetAllClaimsForProjectQuery(project.Id);
    const results = await context.runQuery(query);

    expect(results.map(x => x.partnerId)).toEqual([partner2.id, partner3.id, partner1.id]);
  });

  it("sorts period ids decending", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner1 = context.testData.createPartner(project, p => {
      p.projectRole = "";
      p.name = "XXXXXX";
    });
    const partner2 = context.testData.createPartner(project, p => {
      p.projectRole = "Lead";
      p.name = "ZZZZZZZZ";
    });

    context.testData.createClaim(partner1, 1);
    context.testData.createClaim(partner1, 2);
    context.testData.createClaim(partner1, 3);
    context.testData.createClaim(partner2, 1);
    context.testData.createClaim(partner2, 3);
    context.testData.createClaim(partner2, 2);
    context.testData.createClaim(partner2, 1);

    const query = new GetAllClaimsForProjectQuery(project.Id);
    const results = await context.runQuery(query);

    expect(results.map(x => x.partnerId)).toEqual([partner2.id, partner2.id, partner2.id, partner2.id, partner1.id, partner1.id, partner1.id]);
    expect(results.map(x => x.periodId)).toEqual([3, 2, 1, 1, 3, 2, 1]);
  });
});
