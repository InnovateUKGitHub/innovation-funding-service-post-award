import { TestContext } from "../../testContextProvider";
import mapClaimLineItem from "@server/features/claimLineItems/mapClaimLineItem";
import { ValidationError } from "@server/features/common/appError";
import * as Repositories from "@server/repositories";
import { Authorisation, ProjectRole } from "@framework/types";
import { SaveLineItemsFormDataCommand } from "@server/features/claimLineItems/saveLineItemsFormDataCommand";
import { ClaimLineItemsFormData } from "@framework/types/dtos/claimLineItemsFormData";
import { mapClaimDetails } from "@server/features/claimDetails/mapClaimDetails";

// tslint:disable-next-line:no-big-function
describe("SaveLineItemsFormDataCommand", () => {

  it("should save the comments field", async () => {
    const context = new TestContext();
    const {testData} = context;

    const sfLineItem = testData.createClaimLineItem({persist: false});
    const lineItem = mapClaimLineItem()(sfLineItem as Repositories.ISalesforceClaimLineItem);

    const sfClaimDetails = testData.createClaimDetail();
    const claimDetails = mapClaimDetails(sfClaimDetails, context);

    const dto = {
      lineItems: [lineItem],
      claimDetails: {
        ...claimDetails,
        comments: "this is a comment"
      }
    };

    const command = new SaveLineItemsFormDataCommand("", lineItem.partnerId, lineItem.costCategoryId, lineItem.periodId, dto);
    await context.runCommand(command);

    expect(context.repositories.claimDetails.Items).toHaveLength(1);
    expect(context.repositories.claimDetails.Items.find(x => x.Id === claimDetails.id)!.Acc_ReasonForDifference__c).toEqual("this is a comment");
  });

  it("should return a validation error if the line items passed is missing a description", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claimLineItem = testData.createClaimLineItem({
      persist: false, update: (item) => {
        delete item.Acc_LineItemDescription__c;
      }
    });

    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
    const lineItem = mapClaimLineItem()(claimLineItem as Repositories.ISalesforceClaimLineItem);
    const claimDetails = testData.createClaimDetail();
    const dto: ClaimLineItemsFormData = {
      lineItems: [lineItem],
      claimDetails: {
        id: claimDetails.Id,
        comments: claimDetails.Acc_ReasonForDifference__c
      } as ClaimDetailsDto
    };

    const command = new SaveLineItemsFormDataCommand("", lineItem.partnerId, lineItem.costCategoryId, lineItem.periodId, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
  });

  it("should return a validation error if the line items passed is missing a cost", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claimLineItem = testData.createClaimLineItem({
      persist: false, update: (item) => {
        delete item.Acc_LineItemCost__c;
      }
    });
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
    const lineItem = mapClaimLineItem()(claimLineItem as Repositories.ISalesforceClaimLineItem);
    const claimDetails = testData.createClaimDetail();
    const dto: ClaimLineItemsFormData = {
      lineItems: [lineItem],
      claimDetails: {
        id: claimDetails.Id,
        comments: claimDetails.Acc_ReasonForDifference__c
      } as ClaimDetailsDto
    };

    const command = new SaveLineItemsFormDataCommand("", lineItem.partnerId, lineItem.costCategoryId, lineItem.periodId, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
  });

  it("should insert new line items", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claimLineItem = testData.createClaimLineItem({persist: false});
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
    const lineItem = mapClaimLineItem()(claimLineItem as Repositories.ISalesforceClaimLineItem);

    const dto: ClaimLineItemsFormData = {
      lineItems: [lineItem],
      claimDetails: {} as ClaimDetailsDto
    };

    const command = new SaveLineItemsFormDataCommand("", lineItem.partnerId, lineItem.costCategoryId, lineItem.periodId, dto);
    await context.runCommand(command);

    expect(context.repositories.claimLineItems.Items).toHaveLength(1);
    expect(context.repositories.claimLineItems.Items[0]).toEqual(expect.objectContaining(claimLineItem));
  });

  it("should update existing line items", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claimLineItem = testData.createClaimLineItem({persist: false});
    const lineItem = mapClaimLineItem()(claimLineItem as Repositories.ISalesforceClaimLineItem);
    const dto: ClaimLineItemsFormData = {
      lineItems: [lineItem],
      claimDetails: {} as ClaimDetailsDto
    };

    const command = new SaveLineItemsFormDataCommand("", lineItem.partnerId, lineItem.costCategoryId, lineItem.periodId, dto);
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
    await context.runCommand(command);

    expect(context.repositories.claimLineItems.Items).toHaveLength(1);
    expect(context.repositories.claimLineItems.Items[0]).toEqual(expect.objectContaining(claimLineItem));
    const id = context.repositories.claimLineItems.Items[0].Id;

    const update: ClaimLineItemsFormData = {
      ...dto,
      lineItems: [{
        ...lineItem,
        id,
        description: "new description!",
        value: 1234
      }]
    };

    const command2 = new SaveLineItemsFormDataCommand("", lineItem.partnerId, lineItem.costCategoryId, lineItem.periodId, update);
    await context.runCommand(command2);

    expect(context.repositories.claimLineItems.Items).toHaveLength(1);
    expect(context.repositories.claimLineItems.Items[0]).toEqual({
      ...claimLineItem,
      Id: id,
      Acc_LineItemDescription__c: "new description!",
      Acc_LineItemCost__c: 1234
    });

  });

  it("should delete items not passed in", async () => {
    const context = new TestContext();
    const {testData} = context;

    const partner = testData.createPartner();
    const costCategory = testData.createCostCategory();
    const claimLineItem1 = testData.createClaimLineItem({partner, costCategory, persist: false});
    const claimLineItem2 = testData.createClaimLineItem({
      periodId: claimLineItem1.Acc_ProjectPeriodNumber__c,
      partner,
      costCategory,
      persist: false
    });
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);

    const lineItem1 = mapClaimLineItem()(claimLineItem1 as Repositories.ISalesforceClaimLineItem);
    const lineItem2 = mapClaimLineItem()(claimLineItem2 as Repositories.ISalesforceClaimLineItem);

    const dto: ClaimLineItemsFormData = {
      lineItems: [lineItem1, lineItem2],
      claimDetails: {} as ClaimDetailsDto
    };

    const command = new SaveLineItemsFormDataCommand("", partner.Id, costCategory.Id, lineItem1.periodId, dto);
    await context.runCommand(command);

    expect(context.repositories.claimLineItems.Items).toHaveLength(2);
    expect(context.repositories.claimLineItems.Items[0]).toEqual(expect.objectContaining(claimLineItem1));
    expect(context.repositories.claimLineItems.Items[1]).toEqual(expect.objectContaining(claimLineItem2));

    const id1 = context.repositories.claimLineItems.Items[0].Id;
    const update = {
      ...dto,
      lineItems: [{
        ...lineItem1,
        id: id1
      }]
    };
    const command2 = new SaveLineItemsFormDataCommand("", lineItem1.partnerId, lineItem1.costCategoryId, lineItem1.periodId, update);
    await context.runCommand(command2);
    expect(context.repositories.claimLineItems.Items).toHaveLength(1);
    expect(context.repositories.claimLineItems.Items[0]).toEqual({
      ...claimLineItem1,
      Id: id1
    });

  });

  test("expect comments to be updated", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claimDetail = context.testData.createClaimDetail(project, undefined, partner, 1, x => x.Acc_ReasonForDifference__c = "An old message" );
    const claimDetails = mapClaimDetails(claimDetail, context);

    claimDetails.comments = "A new message";

    const dto = {
      claimDetails,
      lineItems: []
    };

    const command = new SaveLineItemsFormDataCommand("", partner.Id, claimDetail.Acc_CostCategory__c, 1, dto);
    await context.runCommand(command);

    expect(claimDetail.Acc_ReasonForDifference__c).toBe("A new message");
  });

  test("expect comments to be null", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const claimDetail = context.testData.createClaimDetail(project, undefined, partner, undefined, x => x.Acc_ReasonForDifference__c = "An old message" );
    const claimDetails = mapClaimDetails(claimDetail, context);

    claimDetails.comments = null;

    const dto = {
      claimDetails,
      lineItems: []
    };

    const command = new SaveLineItemsFormDataCommand("", partner.Id, claimDetail.Acc_CostCategory__c, 1, dto);
    await context.runCommand(command);

    expect(claimDetail.Acc_ReasonForDifference__c).toBe(null);
  });
});

describe("accessControl", () => {
  test("accessControl - Partner Finance contact passes", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const command = new SaveLineItemsFormDataCommand(project.Id, partner.Id, "", 1, {} as ClaimLineItemsFormData);
    const auth    = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.Unknown,
        partnerRoles: { [partner.Id]: ProjectRole.FinancialContact }
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(true);
  });

  test("accessControl - all other roles fail", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const command = new SaveLineItemsFormDataCommand(project.Id, partner.Id, "", 1, {} as ClaimLineItemsFormData);
    const auth    = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager,
        partnerRoles: { [partner.Id]: ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager }
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(false);
  });
});
