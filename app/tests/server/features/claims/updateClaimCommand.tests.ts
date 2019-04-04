import { TestContext } from "../../testContextProvider";
import { UpdateClaimCommand } from "../../../../src/server/features/claims/updateClaim";
import mapClaim from "../../../../src/server/features/claims/mapClaim";
import { ClaimStatus } from "../../../../src/types/constants";
import { ValidationError } from "../../../../src/server/features/common/appError";

describe("UpdateClaimCommand", () => {
  it("when claim id not set expect validation exception", async () => {
    const context = new TestContext();
    const {testData} = context;

    const dto = mapClaim(context)(testData.createClaim());
    dto.id = null!;

    const project = context.testData.createProject();

    const command = new UpdateClaimCommand(project.Id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("when status updated to draft expect item updated", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim(null!, null!, x => x.Acc_ClaimStatus__c = "New" as any);
    const dto = mapClaim(context)(claim);

    const project = context.testData.createProject();

    dto.status = ClaimStatus.DRAFT;

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.DRAFT);
  });

  it("when status updated to submitted expect item updated", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim(null!, null!, x => x.Acc_ClaimStatus__c = ClaimStatus.DRAFT);
    const dto = mapClaim(context)(claim);

    const project = context.testData.createProject();

    dto.status = ClaimStatus.SUBMITTED;

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.SUBMITTED);
  });

  it("when status updated to approved expect item updated", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim(null!, null!, x => x.Acc_ClaimStatus__c = ClaimStatus.DRAFT);
    const dto = mapClaim(context)(claim);

    const project = context.testData.createProject();

    dto.status = ClaimStatus.AWAITING_IUK_APPROVAL;

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.AWAITING_IUK_APPROVAL);
  });

  it("when status updated to queried expect item updated", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim(null!, null!, x => x.Acc_ClaimStatus__c = ClaimStatus.DRAFT);
    const dto = mapClaim(context)(claim);

    const project = context.testData.createProject();

    dto.status = ClaimStatus.MO_QUERIED;

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.MO_QUERIED);
  });

  it("when status updated to something other than draft or submitted expect error", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim(null!, null!, x => x.Acc_ClaimStatus__c = ClaimStatus.DRAFT);
    const dto = mapClaim(context)(claim);

    const project = context.testData.createProject();

    dto.status = ClaimStatus.PAID;

    const command = new UpdateClaimCommand(project.Id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("can update when status is Innovate Queried", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim(null!, null!, x => x.Acc_ClaimStatus__c = ClaimStatus.INNOVATE_QUERIED);
    const dto = mapClaim(context)(claim);
    const project = context.testData.createProject();
    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.INNOVATE_QUERIED);
  });

  it("when message updated expect item updated", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim(null!, null!, x => x.Acc_LineItemDescription__c = "Original Message");
    const dto = mapClaim(context)(claim);

    const project = context.testData.createProject();

    dto.comments = "A New Message";

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);

    expect(claim.Acc_LineItemDescription__c).toBe("A New Message");
  });

  it("when message is over 1000 characters expect expection", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim();
    const dto = mapClaim(context)(claim);

    const project = context.testData.createProject();

    dto.comments = "a".repeat(1001);

    const command = new UpdateClaimCommand(project.Id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("when message is 1000 characters expect no exception", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim();
    const dto = mapClaim(context)(claim);

    const project = context.testData.createProject();

    dto.comments = "a".repeat(1000);

    const command = new UpdateClaimCommand(project.Id, dto);
    await context.runCommand(command);
  });

  it("when claim is over limits for any cost category expect exception", async () => {
    const context      = new TestContext();
    const testData     = context.testData;
    const partner      = testData.createPartner();
    const claim        = testData.createClaim(partner, 2);
    const costCategory = testData.createCostCategory();

    // TODO offer costs are currently hard coded to 10000
    testData.createClaimDetail(costCategory, partner, 1, (x) => { x.Acc_PeriodCostCategoryTotal__c = 1000000;});
    testData.createClaimDetail(costCategory, partner, 2, (x) => { x.Acc_PeriodCostCategoryTotal__c = 1000000;});

    const project = context.testData.createProject();

    const dto = mapClaim(context)(claim);
    const command = new UpdateClaimCommand(project.Id, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

});
