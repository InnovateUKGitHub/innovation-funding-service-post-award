import { TestContext } from "../../testContextProvider";
import { UpdateClaimCommand } from "../../../../src/server/features/claims/updateClaim";
import { ValidationError } from "../../../../src/shared/validation";
import mapClaim from "../../../../src/server/features/claims/mapClaim";
import { ClaimStatus } from "../../../../src/types/constants";

describe('UpdateClaimCommand', () => {
  it('when claim id not set expect validation expection', async () => {
    const context = new TestContext();
    const {testData} = context;

    const dto = mapClaim(context)(testData.createClaim());
    dto.id = null;

    let command = new UpdateClaimCommand(dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it('when status updated to draft expect item updated', async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim(null, null, (x => x.Acc_ClaimStatus__c = "New"));
    const dto = mapClaim(context)(claim);

    dto.status = ClaimStatus.DRAFT;

    let command = new UpdateClaimCommand(dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe("Draft");
  });

  it('when status updated to submitted expect item updated', async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim(null, null, (x => x.Acc_ClaimStatus__c = "Draft"));
    const dto = mapClaim(context)(claim);

    dto.status = "Submitted";

    let command = new UpdateClaimCommand(dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe("Submitted");
  });

  it('when status updated to approved expect item updated', async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim(null, null, (x => x.Acc_ClaimStatus__c = "Draft"));
    const dto = mapClaim(context)(claim);

    dto.status = "Awaiting IUK Approval";

    let command = new UpdateClaimCommand(dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe("Awaiting IUK Approval");
  });

  it('when status updated to queried expect item updated', async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim(null, null, (x => x.Acc_ClaimStatus__c = "Draft"));
    const dto = mapClaim(context)(claim);

    dto.status = "MO Queried";

    let command = new UpdateClaimCommand(dto);
    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe("MO Queried");
  });

  it('when status updated to something other than draft or submitted expect error', async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim(null, null, (x => x.Acc_ClaimStatus__c = "Draft"));
    const dto = mapClaim(context)(claim);

    dto.status = "Paid";

    let command = new UpdateClaimCommand(dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it('when message updated expect item updated', async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim(null, null, (x => x.Acc_LineItemDescription__c = "Original Message"));
    const dto = mapClaim(context)(claim);

    dto.comments = "A New Message";

    let command = new UpdateClaimCommand(dto);
    await context.runCommand(command);

    expect(claim.Acc_LineItemDescription__c).toBe("A New Message");
  });

  it('when message is over 1000 characters expect expection', async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim();
    const dto = mapClaim(context)(claim);

    dto.comments = "a".repeat(1001);

    let command = new UpdateClaimCommand(dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it('when message is 1000 characters expect no exception', async () => {
    const context = new TestContext();
    const {testData} = context;

    const claim = testData.createClaim();
    const dto = mapClaim(context)(claim);

    dto.comments = "a".repeat(1000);

    let command = new UpdateClaimCommand(dto);
    await context.runCommand(command);
  });

  it('when claim is over limits for any cost category expect exception', async () => {
    const context = new TestContext();
    const {testData} = context;

    const partner = testData.createPartner();
    const costCategory = testData.createCostCategory();
    const claim = testData.createClaim(partner, 2);

    // to do offer costs are currently hard coded to 10000
    const period1Cost = testData.createClaimDetail(costCategory, partner, 1, (x) => { x.Acc_PeriodCostCategoryTotal__c = 1000000;});
    const period2Cost = testData.createClaimDetail(costCategory, partner, 2, (x) => { x.Acc_PeriodCostCategoryTotal__c = 1000000;});

    const dto = mapClaim(context)(claim);

    let command = new UpdateClaimCommand(dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

});
