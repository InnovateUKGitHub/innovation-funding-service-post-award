import { TestContext } from "../../testContextProvider";
import { GetClaimStatusChangesQuery } from "@server/features/claims/getClaimStatusChangesQuery";
import { ClaimStatusChangeDto } from "@framework/types";
import { DateTime } from "luxon";
import { stringComparator } from "@framework/util/comparator";

// tslint:disable: no-big-function
describe("GetClaimStatusChanges", () => {
  it("returns empty array if no data for claim", async () => {
    const context = new TestContext();

    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner);

    const query = new GetClaimStatusChangesQuery(partner.Acc_ProjectId__c, partner.Id, claim.Acc_ProjectPeriodNumber__c);

    const result = await context.runQuery(query);

    expect(result).toEqual([]);
  });

  it("returns item values correectly", async () => {
    const context = new TestContext();

    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner);

    const existing = context.testData.createClaimStatusChange(claim);

    const query = new GetClaimStatusChangesQuery(partner.Acc_ProjectId__c, partner.Id, claim.Acc_ProjectPeriodNumber__c);

    const result = await context.runQuery(query);

    const expected: ClaimStatusChangeDto = {
      id: existing.Id,
      claimId: existing.Acc_Claim__c,
      comments: existing.Acc_ExternalComment__c,
      createdBy: existing.CreatedBy.Name,
      createdDate: new Date(existing.CreatedDate),
      newStatus: existing.Acc_NewClaimStatus__c,
      previousStatus: existing.Acc_PreviousClaimStatus__c
    };
    expect(result).toEqual([expected]);
  });

  it("returns item sorted by created date in reverse", async () => {
    const context = new TestContext();

    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner);

    const existing = context.testData.range(10, i => context.testData.createClaimStatusChange(claim, { CreatedDate: DateTime.fromString("2000-01-01", "yyyy-MM-dd").plus({ days: i * 10 }).toISO() }));

    const query = new GetClaimStatusChangesQuery(partner.Acc_ProjectId__c, partner.Id, claim.Acc_ProjectPeriodNumber__c);

    const result = await context.runQuery(query);

    const expected = existing.map(x => x.CreatedDate).map(x => DateTime.fromISO(x).toJSDate());
    expected.reverse();

    expect(result.map(x => x.createdDate)).toEqual(expected);
  });

  it("returns items filtered by claim requested", async () => {
    const context = new TestContext();

    const partner = context.testData.createPartner();
    const claim1 = context.testData.createClaim(partner, 1);
    const claim2 = context.testData.createClaim(partner, 2);
    const claim3 = context.testData.createClaim(partner, 2);

    context.testData.range(10, i => context.testData.createClaimStatusChange(claim1));
    const claim2Existing = context.testData.range(10, i => context.testData.createClaimStatusChange(claim2));
    context.testData.range(10, i => context.testData.createClaimStatusChange(claim3));

    const query = new GetClaimStatusChangesQuery(partner.Acc_ProjectId__c, partner.Id, 2);

    const result = await context.runQuery(query);

    const expected = claim2Existing.map(x => x.Id);

    expect(result.map(x => x.claimId)).toEqual(context.testData.range(10, _ => claim2.Id));
    expect(result.map(x => x.id)).toEqual(expected);
  });

  it("if user is mo expect result to includes partner not visible and partner visible", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const claim = context.testData.createClaim(partner, 1);
    // create records visible to partner
    const existingPartnerVisible = context.testData.range(10, i => context.testData.createClaimStatusChange(claim, { Acc_ParticipantVisibility__c: true }));
    // create records not visible to partner
    const existingPartnerNotVisible = context.testData.range(10, i => context.testData.createClaimStatusChange(claim, { Acc_ParticipantVisibility__c: false }));

    context.testData.createMonitoringOfficer(project, x => x.Acc_ContactId__r.Email = context.user.email);

    const query = new GetClaimStatusChangesQuery(partner.Acc_ProjectId__c, partner.Id, 1);

    const result = await context.runQuery(query);

    const expected = [...existingPartnerVisible, ...existingPartnerNotVisible].map(x => x.Id).sort(stringComparator);

    expect(result.map(x => x.id).sort(stringComparator)).toEqual(expected);
  });

  it("if user is not mo expect result to only include partner not visible", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const claim = context.testData.createClaim(partner, 1);
    // create records visible to partner
    const existingPartnerVisible = context.testData.range(10, i => context.testData.createClaimStatusChange(claim, { Acc_ParticipantVisibility__c: true }));
    // create records not visible to partner
    context.testData.range(10, i => context.testData.createClaimStatusChange(claim, { Acc_ParticipantVisibility__c: false }));

    context.testData.createCurrentUserAsProjectManager(project);

    const query = new GetClaimStatusChangesQuery(partner.Acc_ProjectId__c, partner.Id, 1);

    const result = await context.runQuery(query);

    const expected = existingPartnerVisible.map(x => x.Id).sort(stringComparator);

    expect(result.map(x => x.id).sort(stringComparator)).toEqual(expected);
  });
});
