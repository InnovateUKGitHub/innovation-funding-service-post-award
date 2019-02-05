import { CommandBase, ValidationError } from "../common";
import { ClaimLineItemDtosValidator } from "../../../ui/validators/claimLineItemDtosValidator";
import { isNumber } from "../../../util/NumberHelper";
import { Authorisation, IContext, ProjectRole } from "../../../types";

export class SaveLineItemsCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: string,
    private readonly partnerId: string,
    private readonly costCategoryId: string,
    private readonly periodId: number,
    private readonly lineItems: ClaimLineItemDto[]
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.for(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    const validationResult = new ClaimLineItemDtosValidator(this.lineItems, true);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }
    const existing = (await context.repositories.claimLineItems.getAllForCategory(this.partnerId, this.costCategoryId, this.periodId) || []);
    const filtered     = this.lineItems.filter(x => !!x.description || isNumber(x.value));
    const updateDtos   = filtered.filter(item => !!item.id);
    const insertDtos   = filtered.filter(item => !item.id);
    const persistedIds = updateDtos.map(x => x.id);

    const deleteItems = existing.filter(x => persistedIds.indexOf(x.Id) === -1).map(x => x.Id);

    const updateItems = updateDtos.map(x => ({
      Id: x.id,
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
    ]).then(() => true);
  }
}
