import { ClaimStatus } from "@framework/constants/claimStatus";
import { TestContext } from "@tests/test-utils/testContextProvider";
import { ClaimDocumentsStore } from "./claimDocumentsStore";
import { ClaimsStore } from "./claimsStore";
import { CostSummariesStore } from "./costsSummariesStore";
import { PartnerDocumentsStore } from "./partnerDocumentsStore";
import { PartnersStore } from "./partnersStore";

describe("claims by project", () => {
  describe("getAllClaimsForProject", () => {
    beforeAll(() => {
      // suppress info about filed salesforce attempts since test asserts failure anyway and it pollutes the report
      jest.spyOn(console, "info").mockImplementation(jest.fn());
    });

    it("should return the claims for the queried project", async () => {
      const context = new TestContext();
      const testStore = context.testStore;
      const project = await testStore.createProject();
      const partner = await testStore.createPartner(project);
      const claim = await testStore.createClaim(partner);
      const costSummariesStore = new CostSummariesStore(context.testStore.getState, context.testStore.dispatch);
      const partnerDocumentsStore = new PartnerDocumentsStore(context.testStore.getState, context.testStore.dispatch);
      const partnerStore = new PartnersStore(
        partnerDocumentsStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimDocumentsStore = new ClaimDocumentsStore(
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimsStore = new ClaimsStore(
        costSummariesStore,
        claimDocumentsStore,
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const foundClaims = claimsStore.getAllClaimsForProject(project.Id).data;
      expect(foundClaims?.[0].id).toEqual(claim.Id);
    });

    it("should return an empty array when there are no claims for the queried project", async () => {
      const context = new TestContext();
      const testStore = context.testStore;
      const project = await testStore.createProject();
      const partner = await testStore.createPartner(project);
      await testStore.createClaim(partner);
      const costSummariesStore = new CostSummariesStore(context.testStore.getState, context.testStore.dispatch);
      const partnerDocumentsStore = new PartnerDocumentsStore(context.testStore.getState, context.testStore.dispatch);
      const partnerStore = new PartnersStore(
        partnerDocumentsStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimDocumentsStore = new ClaimDocumentsStore(
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimsStore = new ClaimsStore(
        costSummariesStore,
        claimDocumentsStore,
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const foundClaims = claimsStore.getAllClaimsForProject("not real" as ProjectId).data;
      expect(foundClaims).toEqual([]);
    });
  });

  describe("getActiveClaimsForProject", () => {
    it("should return the open claims", async () => {
      const context = new TestContext();
      const testStore = context.testStore;
      const project = await testStore.createProject();
      const partner = await testStore.createPartner(project);
      await testStore.createClaim(partner, undefined, x => (x.Acc_ClaimStatus__c = ClaimStatus.APPROVED));
      const draftClaim = await testStore.createClaim(
        partner,
        undefined,
        x => (x.Acc_ClaimStatus__c = ClaimStatus.DRAFT),
      );
      const costSummariesStore = new CostSummariesStore(context.testStore.getState, context.testStore.dispatch);
      const partnerDocumentsStore = new PartnerDocumentsStore(context.testStore.getState, context.testStore.dispatch);
      const partnerStore = new PartnersStore(
        partnerDocumentsStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimDocumentsStore = new ClaimDocumentsStore(
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimsStore = new ClaimsStore(
        costSummariesStore,
        claimDocumentsStore,
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const foundClaims = claimsStore.getActiveClaimsForProject(project.Id).data;
      expect(foundClaims).toHaveLength(1);
      expect(foundClaims?.[0].id).toEqual(draftClaim.Id);
    });

    it("should return an empty array when there are no open claims", async () => {
      const context = new TestContext();
      const testStore = context.testStore;
      const project = await testStore.createProject();
      const partner = await testStore.createPartner(project);
      await testStore.createClaim(partner, undefined, x => (x.Acc_ClaimStatus__c = ClaimStatus.APPROVED));
      const costSummariesStore = new CostSummariesStore(context.testStore.getState, context.testStore.dispatch);
      const partnerDocumentsStore = new PartnerDocumentsStore(context.testStore.getState, context.testStore.dispatch);
      const partnerStore = new PartnersStore(
        partnerDocumentsStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimDocumentsStore = new ClaimDocumentsStore(
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimsStore = new ClaimsStore(
        costSummariesStore,
        claimDocumentsStore,
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const foundClaims = claimsStore.getActiveClaimsForProject(project.Id).data;
      expect(foundClaims).toEqual([]);
    });
  });
  describe("getInactiveClaimsForProject", () => {
    it("should return the previous claims", async () => {
      const context = new TestContext();
      const testStore = context.testStore;
      const project = await testStore.createProject();
      const partner = await testStore.createPartner(project);
      const approvedClaim = await testStore.createClaim(
        partner,
        undefined,
        x => (x.Acc_ClaimStatus__c = ClaimStatus.APPROVED),
      );
      await testStore.createClaim(partner, undefined, x => (x.Acc_ClaimStatus__c = ClaimStatus.DRAFT));
      const costSummariesStore = new CostSummariesStore(context.testStore.getState, context.testStore.dispatch);
      const partnerDocumentsStore = new PartnerDocumentsStore(context.testStore.getState, context.testStore.dispatch);
      const partnerStore = new PartnersStore(
        partnerDocumentsStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimDocumentsStore = new ClaimDocumentsStore(
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimsStore = new ClaimsStore(
        costSummariesStore,
        claimDocumentsStore,
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const foundClaims = claimsStore.getInactiveClaimsForProject(project.Id).data;
      expect(foundClaims).toHaveLength(1);
      expect(foundClaims?.[0].id).toEqual(approvedClaim.Id);
    });
    it("should return empty array when there is no open claims", async () => {
      const context = new TestContext();
      const testStore = context.testStore;
      const project = await testStore.createProject();
      const partner = await testStore.createPartner(project);
      await testStore.createClaim(partner, undefined, x => (x.Acc_ClaimStatus__c = ClaimStatus.DRAFT));
      await testStore.createClaim(partner, undefined, x => (x.Acc_ClaimStatus__c = ClaimStatus.DRAFT));
      const costSummariesStore = new CostSummariesStore(context.testStore.getState, context.testStore.dispatch);
      const partnerDocumentsStore = new PartnerDocumentsStore(context.testStore.getState, context.testStore.dispatch);
      const partnerStore = new PartnersStore(
        partnerDocumentsStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimDocumentsStore = new ClaimDocumentsStore(
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimsStore = new ClaimsStore(
        costSummariesStore,
        claimDocumentsStore,
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const foundClaims = claimsStore.getInactiveClaimsForProject(project.Id).data;
      expect(foundClaims).toEqual([]);
    });
  });
});
describe("claims by partner", () => {
  describe("getAllClaimsForPartner", () => {
    it("should return the claims for the queried partner", async () => {
      const context = new TestContext();
      const testStore = context.testStore;
      const project = await testStore.createProject();
      const partner = await testStore.createPartner(project);
      const claim = await testStore.createClaim(partner);
      const costSummariesStore = new CostSummariesStore(context.testStore.getState, context.testStore.dispatch);
      const partnerDocumentsStore = new PartnerDocumentsStore(context.testStore.getState, context.testStore.dispatch);
      const partnerStore = new PartnersStore(
        partnerDocumentsStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimDocumentsStore = new ClaimDocumentsStore(
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimsStore = new ClaimsStore(
        costSummariesStore,
        claimDocumentsStore,
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const foundClaims = claimsStore.getAllClaimsForPartner(partner.id).data;
      expect(foundClaims?.[0].id).toEqual(claim.Id);
    });

    it("should return an empty array when there are no claims for the queried project", async () => {
      const context = new TestContext();
      const testStore = context.testStore;
      const project = await testStore.createProject();
      const partner = await testStore.createPartner(project);
      await testStore.createClaim(partner);
      const costSummariesStore = new CostSummariesStore(context.testStore.getState, context.testStore.dispatch);
      const partnerDocumentsStore = new PartnerDocumentsStore(context.testStore.getState, context.testStore.dispatch);
      const partnerStore = new PartnersStore(
        partnerDocumentsStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimDocumentsStore = new ClaimDocumentsStore(
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimsStore = new ClaimsStore(
        costSummariesStore,
        claimDocumentsStore,
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const foundClaims = claimsStore.getAllClaimsForPartner("not real" as PartnerId).data;
      expect(foundClaims).toEqual([]);
    });
  });

  describe("getActiveClaimsForProject", () => {
    it("should return the open claims", async () => {
      const context = new TestContext();
      const testStore = context.testStore;
      const project = await testStore.createProject();
      const partner = await testStore.createPartner(project);
      await testStore.createClaim(partner, undefined, x => (x.Acc_ClaimStatus__c = ClaimStatus.APPROVED));
      const draftClaim = await testStore.createClaim(
        partner,
        undefined,
        x => (x.Acc_ClaimStatus__c = ClaimStatus.DRAFT),
      );
      const costSummariesStore = new CostSummariesStore(context.testStore.getState, context.testStore.dispatch);
      const partnerDocumentsStore = new PartnerDocumentsStore(context.testStore.getState, context.testStore.dispatch);
      const partnerStore = new PartnersStore(
        partnerDocumentsStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimDocumentsStore = new ClaimDocumentsStore(
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimsStore = new ClaimsStore(
        costSummariesStore,
        claimDocumentsStore,
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const foundClaim = claimsStore.getActiveClaimForPartner(partner.id).data;
      expect(foundClaim?.id).toEqual(draftClaim.Id);
    });

    it("should return an empty array when there are no open claims", async () => {
      const context = new TestContext();
      const testStore = context.testStore;
      const project = await testStore.createProject();
      const partner = await testStore.createPartner(project);
      await testStore.createClaim(partner, undefined, x => (x.Acc_ClaimStatus__c = ClaimStatus.APPROVED));
      const costSummariesStore = new CostSummariesStore(context.testStore.getState, context.testStore.dispatch);
      const partnerDocumentsStore = new PartnerDocumentsStore(context.testStore.getState, context.testStore.dispatch);
      const partnerStore = new PartnersStore(
        partnerDocumentsStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimDocumentsStore = new ClaimDocumentsStore(
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimsStore = new ClaimsStore(
        costSummariesStore,
        claimDocumentsStore,
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const foundClaim = claimsStore.getActiveClaimForPartner(partner.id).data;
      expect(foundClaim).toBeNull();
    });
  });
  describe("getInactiveClaimsForPartner", () => {
    it("should return the previous claims", async () => {
      const context = new TestContext();
      const testStore = context.testStore;
      const project = await testStore.createProject();
      const partner = await testStore.createPartner(project);
      const approvedClaim = await testStore.createClaim(
        partner,
        undefined,
        x => (x.Acc_ClaimStatus__c = ClaimStatus.APPROVED),
      );
      await testStore.createClaim(partner, undefined, x => (x.Acc_ClaimStatus__c = ClaimStatus.DRAFT));
      const costSummariesStore = new CostSummariesStore(context.testStore.getState, context.testStore.dispatch);
      const partnerDocumentsStore = new PartnerDocumentsStore(context.testStore.getState, context.testStore.dispatch);
      const partnerStore = new PartnersStore(
        partnerDocumentsStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimDocumentsStore = new ClaimDocumentsStore(
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimsStore = new ClaimsStore(
        costSummariesStore,
        claimDocumentsStore,
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const foundClaims = claimsStore.getInactiveClaimsForPartner(partner.id).data;
      expect(foundClaims).toHaveLength(1);
      expect(foundClaims?.[0].id).toEqual(approvedClaim.Id);
    });
    it("should return empty array when there is no open claims", async () => {
      const context = new TestContext();
      const testStore = context.testStore;
      const project = await testStore.createProject();
      const partner = await testStore.createPartner(project);
      await testStore.createClaim(partner, undefined, x => (x.Acc_ClaimStatus__c = ClaimStatus.DRAFT));
      await testStore.createClaim(partner, undefined, x => (x.Acc_ClaimStatus__c = ClaimStatus.DRAFT));
      const costSummariesStore = new CostSummariesStore(context.testStore.getState, context.testStore.dispatch);
      const partnerDocumentsStore = new PartnerDocumentsStore(context.testStore.getState, context.testStore.dispatch);
      const partnerStore = new PartnersStore(
        partnerDocumentsStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimDocumentsStore = new ClaimDocumentsStore(
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const claimsStore = new ClaimsStore(
        costSummariesStore,
        claimDocumentsStore,
        partnerStore,
        context.testStore.getState,
        context.testStore.dispatch,
      );
      const foundClaims = claimsStore.getInactiveClaimsForPartner(partner.id).data;
      expect(foundClaims).toEqual([]);
    });
  });
});
