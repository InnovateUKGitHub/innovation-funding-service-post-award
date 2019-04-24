import { TestContext } from "../../testContextProvider";
import mapClaimLineItem from "@server/features/claimLineItems/mapClaimLineItem";
import { SaveLineItemsCommand } from "@server/features/claimLineItems";
import { ValidationError } from "@server/features/common/appError";
import * as Repositories from "@server/repositories";
import { Authorisation, ProjectRole } from "@framework/types";

describe("UpdateClaimLineItemsCommand", () => {

  it("should insert new line items", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claimLineItem = testData.createClaimLineItem({persist: false});
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
    const dto = mapClaimLineItem()(claimLineItem as Repositories.ISalesforceClaimLineItem);

    const command = new SaveLineItemsCommand("", dto.partnerId, dto.costCategoryId, dto.periodId, [dto]);
    await context.runCommand(command);

    expect(context.repositories.claimLineItems.Items).toHaveLength(1);
    expect(context.repositories.claimLineItems.Items[0]).toEqual(expect.objectContaining(claimLineItem));
  });

  it("should update existing line items", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claimLineItem = testData.createClaimLineItem({persist: false});
    const dto = mapClaimLineItem()(claimLineItem as Repositories.ISalesforceClaimLineItem);

    const command = new SaveLineItemsCommand("", dto.partnerId, dto.costCategoryId, dto.periodId, [dto]);
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
    await context.runCommand(command);

    expect(context.repositories.claimLineItems.Items).toHaveLength(1);
    expect(context.repositories.claimLineItems.Items[0]).toEqual(expect.objectContaining(claimLineItem));
    const id = context.repositories.claimLineItems.Items[0].Id;

    const update = {
      ...dto,
      id,
      description: "new description!",
      value: 1234
    };

    const command2 = new SaveLineItemsCommand("", dto.partnerId, dto.costCategoryId, dto.periodId, [update]);
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

    const claimLineItem1 = testData.createClaimLineItem({persist: false});
    const claimLineItem2 = testData.createClaimLineItem({persist: false});
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);

    const dto1 = mapClaimLineItem()(claimLineItem1 as Repositories.ISalesforceClaimLineItem);
    const dto2 = mapClaimLineItem()(claimLineItem2 as Repositories.ISalesforceClaimLineItem);

    const command = new SaveLineItemsCommand("", dto1.partnerId, dto1.costCategoryId, dto1.periodId, [dto1, dto2]);
    await context.runCommand(command);

    expect(context.repositories.claimLineItems.Items).toHaveLength(2);
    expect(context.repositories.claimLineItems.Items[0]).toEqual(expect.objectContaining(claimLineItem1));
    expect(context.repositories.claimLineItems.Items[1]).toEqual(expect.objectContaining(claimLineItem2));

    const id1 = context.repositories.claimLineItems.Items[0].Id;

    const update = {
      ...dto1,
      id1
    };

    const command2 = new SaveLineItemsCommand("", dto1.partnerId, dto1.costCategoryId, dto1.periodId, [update]);
    await context.runCommand(command2);

    expect(context.repositories.claimLineItems.Items).toHaveLength(1);
    expect(context.repositories.claimLineItems.Items[0]).toEqual({
      ...claimLineItem1,
      Id: id1
    });

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
    const dto = mapClaimLineItem()(claimLineItem as Repositories.ISalesforceClaimLineItem);

    const command = new SaveLineItemsCommand("", dto.partnerId, dto.costCategoryId, dto.periodId, [dto]);
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
    const dto = mapClaimLineItem()(claimLineItem as Repositories.ISalesforceClaimLineItem);

    const command = new SaveLineItemsCommand("", dto.partnerId, dto.costCategoryId, dto.periodId, [dto]);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
  });

  test("accessControl - Partner Finance contact passes", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const command = new SaveLineItemsCommand(project.Id, partner.Id, "", 1, []);
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
    const command = new SaveLineItemsCommand(project.Id, partner.Id, "", 1, []);
    const auth    = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager,
        partnerRoles: { [partner.Id]: ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager }
      }
    });

    expect(await context.runAccessControl(auth, command)).toBe(false);
  });
});
