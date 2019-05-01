import { CommandBase, ValidationError } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { ClaimDetailsValidator } from "@ui/validators";
import { isNumber } from "@util/NumberHelper";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { ISalesforceClaimDetails } from "@server/repositories";

export class SaveClaimDetails extends CommandBase<boolean> {
  constructor(
    private readonly projectId: string,
    private readonly partnerId: string,
    private readonly periodId: number,
    private readonly costCategoryId: string,
    private readonly claimDetails: ClaimDetailsDto
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  private async saveLineItems(context: IContext, lineItems: ClaimLineItemDto[]) {
    const existing = (await context.repositories.claimLineItems.getAllForCategory(this.partnerId, this.costCategoryId, this.periodId) || []);
    const filtered     = lineItems.filter(x => !!x.description || isNumber(x.value));
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

  private async saveClaimDetail(context: IContext, claimDetail: ClaimDetailsDto) {
    const update: Updatable<ISalesforceClaimDetails> = {
      Id: claimDetail.id,
      Acc_ReasonForDifference__c: claimDetail.comments
    };

    return context.repositories.claimDetails.update(update);
  }

  protected async Run(context: IContext) {
    const validationResult = new ClaimDetailsValidator(this.claimDetails, true);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    return Promise.all([
      this.saveLineItems(context, this.claimDetails.lineItems),
      this.saveClaimDetail(context, this.claimDetails)
    ]).then(() => true);
  }
}
