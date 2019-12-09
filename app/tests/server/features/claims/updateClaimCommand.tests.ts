// tslint:disable: no-big-function
import { TestContext } from "../../testContextProvider";
import { UpdateClaimCommand } from "@server/features/claims/updateClaim";
import mapClaim from "@server/features/claims/mapClaim";
import { ClaimStatus } from "@framework/constants";
import { ValidationError } from "@server/features/common/appError";
import { Authorisation, ProjectRole } from "@framework/types";

describe("UpdateClaimCommand", () => {
  test("accessControl - Project Monitoring Officer passes", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const command = new UpdateClaimCommand(project.Id, {} as any);
    const auth    = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.MonitoringOfficer,
        partnerRoles: {}
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(true);
  });

  test("accessControl - Partner Financial Contact passes", async () => {
    const context  = new TestContext();
    const project  = context.testData.createProject();
    const claimDto = { partnerId: "abc" };
    const command  = new UpdateClaimCommand(project.Id, claimDto as any);
    const auth     = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.Unknown,
        partnerRoles: { [claimDto.partnerId]: ProjectRole.FinancialContact }
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(true);
  });

  test("accessControl - all other roles fail", async () => {
    const context  = new TestContext();
    const project  = context.testData.createProject();
    const claimDto = { partnerId: "abc" };
    const command  = new UpdateClaimCommand(project.Id, claimDto as any);
    const auth     = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.FinancialContact | ProjectRole.ProjectManager,
        partnerRoles: { [claimDto.partnerId]: ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager }
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(false);
  });

  it("when claim id not set expect validation exception", async () => {
    const context = new TestContext();
    const dto = mapClaim(context)(context.testData.createClaim());
    dto.id = null!;
    const project = context.testData.createProject();
    const command = new UpdateClaimCommand(project.Id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("when status updated to draft expect item updated", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(null!, null!, x => x.Acc_ClaimStatus__c = "New" as any);
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.status = ClaimStatus.DRAFT;

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.DRAFT);
  });

  it("when status updated to submitted expect item updated", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(null!, null!, x => x.Acc_ClaimStatus__c = ClaimStatus.DRAFT);
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.status = ClaimStatus.SUBMITTED;

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.SUBMITTED);
  });

  it("throws a validation error if an iar is required when the claim is submitted", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(null!, null!, x => {
      x.Acc_ClaimStatus__c = ClaimStatus.DRAFT;
      x.Acc_IARRequired__c = true;
    });
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.status = ClaimStatus.SUBMITTED;

    const command = new UpdateClaimCommand(project.Id, dto);
    expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("updates the status to submitted if an iar is required and there are claim documents uploaded", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(null!, null!, x => {
      x.Acc_ClaimStatus__c = ClaimStatus.DRAFT;
      x.Acc_IARRequired__c = true;
    });
    context.testData.createDocument(claim.Id, "cats_are_the_best.txt");
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.status = ClaimStatus.SUBMITTED;

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.SUBMITTED);
  });

  it("when status updated to approved expect item updated", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(null!, null!, x => x.Acc_ClaimStatus__c = ClaimStatus.DRAFT);
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.status = ClaimStatus.AWAITING_IUK_APPROVAL;

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.AWAITING_IUK_APPROVAL);
  });

  it("when status updated to queried expect item updated", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(null!, null!, x => x.Acc_ClaimStatus__c = ClaimStatus.DRAFT);
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.status = ClaimStatus.MO_QUERIED;
    dto.comments = "Test comments";

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.MO_QUERIED);
  });

  it("when status updated to something other than draft or submitted expect error", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(null!, null!, x => x.Acc_ClaimStatus__c = ClaimStatus.DRAFT);
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.status = ClaimStatus.PAID;

    const command = new UpdateClaimCommand(project.Id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("can update when status is Innovate Queried", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(null!, null!, x => x.Acc_ClaimStatus__c = ClaimStatus.INNOVATE_QUERIED);
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();
    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.INNOVATE_QUERIED);
  });

  it("when message updated expect item updated", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim(null!, null!, x => x.Acc_ReasonForDifference__c = "Original Message");
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.comments = "A New Message";

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ReasonForDifference__c).toBe("A New Message");
  });

  it("when message is over 1000 characters expect expection", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim();
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.comments = "a".repeat(1001);

    const command = new UpdateClaimCommand(project.Id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("when message is 1000 characters expect no exception", async () => {
    const context = new TestContext();
    const claim = context.testData.createClaim();
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();

    dto.comments = "a".repeat(1000);

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);
  });

  it("when message is not set and claim status is changing to MO Quried expect validation excetion", async () => {
    const context = new TestContext();
    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner);

    const dto = mapClaim(context)(claim);
    dto.status = ClaimStatus.MO_QUERIED;
    dto.comments = "";

    await expect(context.runCommand(new UpdateClaimCommand(partner.Acc_ProjectId__r.Id, dto))).rejects.toThrow(ValidationError);

    dto.comments = "Some comments";

    await expect(context.runCommand(new UpdateClaimCommand(partner.Acc_ProjectId__r.Id, dto))).resolves.toEqual(true);
  });

  it("when message is not set and claim status is already MO Quried expect no validation excetion", async () => {
    const context = new TestContext();
    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner);
    claim.Acc_ClaimStatus__c = ClaimStatus.MO_QUERIED;

    const dto = mapClaim(context)(claim);
    dto.status = ClaimStatus.MO_QUERIED;
    dto.comments = "";

    await expect(context.runCommand(new UpdateClaimCommand(partner.Acc_ProjectId__r.Id, dto))).resolves.toEqual(true);
  });

  it("when claim is over limits for any cost category expect exception", async () => {
    const context      = new TestContext();
    const testData     = context.testData;
    const project      = testData.createProject();
    const partner      = testData.createPartner();
    const claim        = testData.createClaim(partner, 2);
    const costCategory = testData.createCostCategory();

    testData.createClaimDetail(project, costCategory, partner, 1, (x) => { x.Acc_PeriodCostCategoryTotal__c = 1000000;});
    testData.createClaimDetail(project, costCategory, partner, 2, (x) => { x.Acc_PeriodCostCategoryTotal__c = 1000000;});

    const dto = mapClaim(context)(claim);
    const command = new UpdateClaimCommand(project.Id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("when status has changed expect status change record created", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner, 2);
    claim.Acc_ClaimStatus__c = ClaimStatus.DRAFT;

    const dto = mapClaim(context)(claim);

    dto.status = ClaimStatus.SUBMITTED;

    const command = new UpdateClaimCommand(project.Id, dto);

    expect(context.repositories.claimStatusChanges.Items.length).toBe(0);

    await context.runCommand(command);

    expect(context.repositories.claimStatusChanges.Items.length).toBe(1);

    const statusChange = context.repositories.claimStatusChanges.Items[0];

    expect(statusChange.Acc_Claim__c).toEqual(claim.Id);
  });

  it("when status has not changed expect no status change record", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner, 2);
    claim.Acc_ClaimStatus__c = ClaimStatus.SUBMITTED;

    const dto = mapClaim(context)(claim);

    const command = new UpdateClaimCommand(project.Id, dto);

    await context.runCommand(command);

    expect(context.repositories.claimStatusChanges.Items.length).toBe(0);
  });

  it("when status has changed expect comments to be stored in status change record", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner, 2);
    claim.Acc_ClaimStatus__c = ClaimStatus.SUBMITTED;
    claim.Acc_ReasonForDifference__c = "Orignal Comments";

    const dto = mapClaim(context)(claim);

    dto.status = ClaimStatus.MO_QUERIED;

    const command = new UpdateClaimCommand(project.Id, dto);

    await context.runCommand(command);

    expect(context.repositories.claimStatusChanges.Items.length).toBe(1);
    expect(context.repositories.claimStatusChanges.Items[0].Acc_ExternalComment__c).toBe("Orignal Comments");
    expect(claim.Acc_ReasonForDifference__c).toBe("");

  });

  it("when status has changed to AWAITING_IUK_APPROVAL expect comment to not be external", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner, 2);

    claim.Acc_ClaimStatus__c = ClaimStatus.SUBMITTED;

    const dto = mapClaim(context)(claim);

    dto.status = ClaimStatus.AWAITING_IUK_APPROVAL;

    const command = new UpdateClaimCommand(project.Id, dto);

    await context.runCommand(command);

    expect(context.repositories.claimStatusChanges.Items.length).toBe(1);
    expect(context.repositories.claimStatusChanges.Items[0].Acc_ParticipantVisibility__c).toBe(false);
  });

  it("when status has changed to MO_QUERIED expect comment to be external", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claim = context.testData.createClaim(partner, 2);

    claim.Acc_ClaimStatus__c = ClaimStatus.SUBMITTED;

    const dto = mapClaim(context)(claim);

    dto.status = ClaimStatus.MO_QUERIED;
    dto.comments= "Claim Queried";

    const command = new UpdateClaimCommand(project.Id, dto);

    await context.runCommand(command);

    expect(context.repositories.claimStatusChanges.Items.length).toBe(1);
    expect(context.repositories.claimStatusChanges.Items[0].Acc_ParticipantVisibility__c).toBe(true);
  });

});
