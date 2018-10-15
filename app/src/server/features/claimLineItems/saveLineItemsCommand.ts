import {ICommand, IContext} from "../common/context";
import {ClaimLineItemDto} from "../../../ui/models";

export class SaveLineItemsCommand implements ICommand<boolean> {
  // TODO use updatable here but not working as expected
  constructor(public partnerId: string, public costCategoryId: string, public periodId: number, private lineItems: Partial<ClaimLineItemDto>[]) {
  }

  public async Run(context: IContext) {

    console.log("save", this.partnerId, this.costCategoryId, this.periodId, this.lineItems);

    const existing = (await context.repositories.claimLineItems.getAllForCategory(this.partnerId, this.costCategoryId, this.periodId) || []);
    const updateDtos = this.lineItems.filter(item => !!item.id);
    const insertDtos = this.lineItems.filter(item => !item.id);
    const persistedIds = updateDtos.map(x => x.id);

    const deleteItems = existing.filter(x => persistedIds.indexOf(x.Id) < 0).map(x => x.Id);

    const updateItems = updateDtos.map(x => ({
      Id: x.id!,
      Acc_LineItemDescription__c: x.description,
      Acc_LineItemCost__c: x.value
    }));
    const insertItems = insertDtos.map(x => ({
      Acc_LineItemDescription__c: x.description,
      Acc_LineItemCost__c: x.value,
      Acc_ProjectParticipant__c: x.partnerId,
      Acc_ProjectPeriodNumber__c: x.periodId,
      Acc_CostCategory__c: x.costCategoryId
    }));

    return Promise.all<boolean, string | string[], void>([
      context.repositories.claimLineItems.update(updateItems),
      context.repositories.claimLineItems.insert(insertItems),
      context.repositories.claimLineItems.delete(deleteItems)
    ]).then((resp) => console.log(resp) || true);
  }
}
