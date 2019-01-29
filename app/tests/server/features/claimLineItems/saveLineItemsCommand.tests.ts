import { TestContext } from "../../testContextProvider";
import mapClaimLineItem from "../../../../src/server/features/claimLineItems/mapClaimLineItem";
import {SaveLineItemsCommand} from "../../../../src/server/features/claimLineItems";
import * as Repositories from "../../../../src/server/repositories";
import { ValidationError } from "../../../../src/server/features/common/appError";

describe("UpdateClaimLineItemsCommand", () => {

  it("should insert new line items", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claimLineItem = testData.createClaimLineItem({persist: false});
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
    const dto = mapClaimLineItem(context)(claimLineItem as Repositories.ISalesforceClaimLineItem);

    const command = new SaveLineItemsCommand("", dto.partnerId, dto.costCategoryId, dto.periodId, [dto]);
    await context.runCommand(command);

    expect(context.repositories.claimLineItems.Items).toHaveLength(1);
    expect(context.repositories.claimLineItems.Items[0]).toEqual(expect.objectContaining(claimLineItem));
  });

  it("should update existing line items", async () => {
    const context = new TestContext();
    const {testData} = context;

    const claimLineItem = testData.createClaimLineItem({persist: false});
    const dto = mapClaimLineItem(context)(claimLineItem as Repositories.ISalesforceClaimLineItem);

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

    const dto1 = mapClaimLineItem(context)(claimLineItem1 as Repositories.ISalesforceClaimLineItem);
    const dto2 = mapClaimLineItem(context)(claimLineItem2 as Repositories.ISalesforceClaimLineItem);

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
    const dto = mapClaimLineItem(context)(claimLineItem as Repositories.ISalesforceClaimLineItem);

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
    const dto = mapClaimLineItem(context)(claimLineItem as Repositories.ISalesforceClaimLineItem);

    const command = new SaveLineItemsCommand("", dto.partnerId, dto.costCategoryId, dto.periodId, [dto]);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    expect(context.repositories.claimLineItems.Items).toHaveLength(0);
  });
});
