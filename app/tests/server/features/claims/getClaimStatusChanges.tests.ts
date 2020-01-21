import { TestContext } from "../../testContextProvider";
import { GetClaimStatusChangesQuery } from "@server/features/claims/getClaimStatusChangesQuery";
import { ClaimStatus, ClaimStatusChangeDto } from "@framework/types";
import { DateTime } from "luxon";

// tslint:disable: no-big-function
describe("GetClaimStatusChanges", () => {
  it("returns empty array if no data for claim", async () => {
    const context = new TestContext();

    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner);

    const query = new GetClaimStatusChangesQuery(partner.Acc_ProjectId__r.Id, partner.Id, claim.Acc_ProjectPeriodNumber__c);

    const result = await context.runQuery(query);

    expect(result).toEqual([]);
  });

  it("returns item values corectly", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const claim = context.testData.createClaim(partner);

    context.testData.createCurrentUserAsFinanceContact(project, partner);

    const existing = context.testData.createClaimStatusChange(claim);

    const query = new GetClaimStatusChangesQuery(partner.Acc_ProjectId__r.Id, partner.Id, claim.Acc_ProjectPeriodNumber__c);
    const claimStatuses = await context.repositories.claims.getClaimStatuses();

    const result = await context.runQuery(query);

    const expected: ClaimStatusChangeDto = {
      id: existing.Id,
      claimId: existing.Acc_Claim__c,
      comments: existing.Acc_ExternalComment__c,
      createdDate: new Date(existing.CreatedDate),
      newStatus: existing.Acc_NewClaimStatus__c as ClaimStatus,
      newStatusLabel: claimStatuses.find(x => x.value === existing.Acc_NewClaimStatus__c)!.label,
      previousStatus: existing.Acc_PreviousClaimStatus__c as ClaimStatus,
      previousStatusLabel: claimStatuses.find(x => x.value === existing.Acc_PreviousClaimStatus__c)!.label,
    };
    expect(result).toEqual([expected]);
  });

  it("returns item sorted by created date in reverse", async () => {
    const context = new TestContext();

    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner);

    const existing = context.testData.range(10, i => context.testData.createClaimStatusChange(claim, { CreatedDate: DateTime.fromString("2000-01-01", "yyyy-MM-dd").plus({ days: i * 10 }).toISO() }));

    const query = new GetClaimStatusChangesQuery(partner.Acc_ProjectId__r.Id, partner.Id, claim.Acc_ProjectPeriodNumber__c);

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

    const query = new GetClaimStatusChangesQuery(partner.Acc_ProjectId__r.Id, partner.Id, 2);

    const result = await context.runQuery(query);

    const expected = claim2Existing.map(x => x.Id).reverse();

    expect(result.map(x => x.claimId)).toEqual(context.testData.range(10, _ => claim2.Id));
    expect(result.map(x => x.id)).toEqual(expected);
  });

  it("if user is mo expect result to includes all comments", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const claim = context.testData.createClaim(partner, 1);
    // create records visible to partner
    const existingPartnerVisible = context.testData.range(3, i => context.testData.createClaimStatusChange(claim, { Acc_ParticipantVisibility__c: true }));
    // create records not visible to partner
    const existingPartnerNotVisible = context.testData.range(3, i => context.testData.createClaimStatusChange(claim, { Acc_ParticipantVisibility__c: false }));

    context.testData.createCurrentUserAsMonitoringOfficer(project);

    const query = new GetClaimStatusChangesQuery(partner.Acc_ProjectId__r.Id, partner.Id, 1);

    const result = await context.runQuery(query);

    const expected = [...existingPartnerVisible, ...existingPartnerNotVisible].map(x => x.Acc_ExternalComment__c);

    expect(result.map(x => x.comments)).toEqual(expected);
  });

  it("if user is pm expect result to not include comments not visible to partner", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createLeadPartner(project);
    const claim = context.testData.createClaim(partner, 1);
    // create records visible to partner
    const existingPartnerVisible = context.testData.range(3, i => context.testData.createClaimStatusChange(claim, { Acc_ParticipantVisibility__c: true, Acc_ExternalComment__c: "Visible Comment " + i }));
    // create records not visible to partner
    const existingPartnerNotVisible = context.testData.range(3, i => context.testData.createClaimStatusChange(claim, { Acc_ParticipantVisibility__c: false, Acc_ExternalComment__c: "Not Visible Comment " + i }));

    context.testData.createCurrentUserAsProjectManager(project, partner);

    const query = new GetClaimStatusChangesQuery(partner.Acc_ProjectId__r.Id, partner.Id, 1);

    const result = await context.runQuery(query);

    const expected = [...existingPartnerVisible, ...existingPartnerNotVisible].map(x => existingPartnerVisible.indexOf(x) >= 0 ? x.Acc_ExternalComment__c : "").reverse();

    expect(result.map(x => x.comments)).toEqual(expected);
  });

  it("if user is pm of other partner expect result to not include comments", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner1 = context.testData.createLeadPartner(project);
    const partner2 = context.testData.createPartner(project);

    const claim = context.testData.createClaim(partner2, 1);
    // create records visible to partner
    const existingPartnerVisible = context.testData.range(3, i => context.testData.createClaimStatusChange(claim, { Acc_ParticipantVisibility__c: true, Acc_ExternalComment__c: "Visible Comment " + i }));
    // create records not visible to partner
    const existingPartnerNotVisible = context.testData.range(3, i => context.testData.createClaimStatusChange(claim, { Acc_ParticipantVisibility__c: false, Acc_ExternalComment__c: "Not Visible Comment " + i }));

    context.testData.createCurrentUserAsProjectManager(project, partner1);

    const query = new GetClaimStatusChangesQuery(project.Id, partner2.Id, 1);

    const result = await context.runQuery(query);

    const expected = [...existingPartnerVisible, ...existingPartnerNotVisible].map(x => "");

    expect(result.map(x => x.comments)).toEqual(expected);
  });

  it("if user is fc expect result to only include partner visible comments", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    const claim = context.testData.createClaim(partner, 1);
    // create records visible to partner
    const existingPartnerVisible = context.testData.range(3, i => context.testData.createClaimStatusChange(claim, { Acc_ParticipantVisibility__c: true }));
    // create records not visible to partner
    const existingPartnerNotVisible = context.testData.range(3, i => context.testData.createClaimStatusChange(claim, { Acc_ParticipantVisibility__c: false }));

    context.testData.createCurrentUserAsFinanceContact(project, partner);

    const query = new GetClaimStatusChangesQuery(partner.Acc_ProjectId__r.Id, partner.Id, 1);

    const result = await context.runQuery(query);

    const expected = [...existingPartnerVisible, ...existingPartnerNotVisible].map(x => existingPartnerVisible.indexOf(x) >= 0 ? x.Acc_ExternalComment__c : "").reverse();

    expect(result.map(x => x.comments)).toEqual(expected);
  });
});
