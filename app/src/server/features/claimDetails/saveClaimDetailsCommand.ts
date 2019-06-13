import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { ClaimDetailsValidator } from "@ui/validators";
import { isNumber } from "@framework/util";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { ISalesforceClaimDetails, ISalesforceClaimLineItem } from "@server/repositories";
import { GetCostCategoriesQuery } from "../claims";

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

  protected async Run(context: IContext) {
    this.validateRequest();

    const validationResult = new ClaimDetailsValidator(this.claimDetails, true);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    return Promise.all([
      this.saveLineItems(context, this.claimDetails.lineItems),
      this.saveAssociated(context, this.claimDetails.lineItems),
      this.saveClaimDetail(context, this.claimDetails)
    ]).then(() => true);
  }

  private validateRequest() {
    const validParams = this.projectId && this.partnerId && this.costCategoryId && this.periodId;
    const validDto = this.claimDetails.lineItems.every(x => x.periodId === this.periodId && x.partnerId === this.partnerId && x.costCategoryId === this.costCategoryId);

    if (!validParams || !validDto) {
      throw new BadRequestError("Request is missing required fields");
    }
  }

  private async saveLineItems(context: IContext, lineItems: ClaimLineItemDto[]) {
    const existing = (await context.repositories.claimLineItems.getAllForCategory(this.partnerId, this.costCategoryId, this.periodId) || []);
    const filtered     = lineItems.filter(x => !!x.description || isNumber(x.value));

    const updateDtos   = filtered.filter(item => !!item.id);
    const insertDtos   = filtered.filter(item => !item.id);

    const updateItems: Updatable<ISalesforceClaimLineItem>[] = updateDtos.map(x => ({
      Id: x.id,
      Acc_LineItemDescription__c: x.description,
      Acc_LineItemCost__c: x.value
    }));

    const insertItems: Partial<ISalesforceClaimLineItem>[] = insertDtos.map(x => ({
      Acc_LineItemDescription__c: x.description,
      Acc_LineItemCost__c: x.value,
      Acc_ProjectParticipant__c: x.partnerId,
      Acc_ProjectPeriodNumber__c: x.periodId,
      Acc_CostCategory__c: x.costCategoryId
    }));

    const deleteItems = existing.filter(x => !updateDtos.some(y => x.Id === y.id));

    return Promise.all<boolean, string | string[], void>([
      context.repositories.claimLineItems.update(updateItems),
      context.repositories.claimLineItems.insert(insertItems),
      context.repositories.claimLineItems.delete(deleteItems.map(x => x.Id))
    ]).then(() => true);
  }

  private async saveAssociated(context: IContext, lineItems: ClaimLineItemDto[]) {
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    const hasRelated = costCategories.find(x => x.id === this.costCategoryId)!.hasRelated;
    if(!hasRelated) {
      return;
    }

    const partner = await context.repositories.partners.getById(this.partnerId);

    const relatedCost = lineItems.reduce((a,b) => a + b.value, 0) * partner.Acc_OverheadRate__c / 100;

    const relatedCostCategory = costCategories.find(x => x.organisationType === partner.Acc_OrganisationType__c && x.competitionType === partner.Acc_ProjectId__r.Acc_CompetitionType__c && x.isCalculated);

    if(!relatedCostCategory) {
      return;
    }

    const existing = (await context.repositories.claimLineItems.getAllForCategory(this.partnerId, relatedCostCategory.id, this.periodId));

    const description = `${relatedCostCategory.name} line item`;

    if(existing.length > 0) {
      await context.repositories.claimLineItems.update([{
        Id: existing[0].Id,
        Acc_LineItemDescription__c: description,
        Acc_LineItemCost__c: relatedCost
      }]);
    }
    else {
      await context.repositories.claimLineItems.insert([{
        Acc_LineItemDescription__c: description,
        Acc_LineItemCost__c: relatedCost,
        Acc_ProjectParticipant__c: this.partnerId,
        Acc_ProjectPeriodNumber__c: this.periodId,
        Acc_CostCategory__c: relatedCostCategory.id
        }]);
    }

    if(existing.length > 1) {
      const idsToDelete = existing.filter((x,i) => i > 0).map(x => x.Id);
      await context.repositories.claimLineItems.delete(idsToDelete);
    }

  }

  private async saveClaimDetail(context: IContext, claimDetail: ClaimDetailsDto) {
    const update: Updatable<ISalesforceClaimDetails> = {
      Id: claimDetail.id,
      Acc_ReasonForDifference__c: claimDetail.comments
    };

    return context.repositories.claimDetails.update(update);
  }
}
