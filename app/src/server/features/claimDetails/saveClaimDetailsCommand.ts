import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { ClaimDetailsValidator } from "@ui/validators";
import { isNumber } from "@framework/util";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { ISalesforceClaimLineItem } from "@server/repositories";
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

    const costCategory = await context.runQuery(new GetCostCategoriesQuery()).then(x => x.find(y => y.id === this.costCategoryId));
    if (!costCategory) {
      throw new BadRequestError("Invalid cost category specified");
    }
    else if (costCategory.isCalculated) {
      throw new BadRequestError("Invalid calculated cost category specified");
    }

    const validationResult = new ClaimDetailsValidator(this.claimDetails, true);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    await this.saveClaimDetail(context, this.claimDetails);
    await this.saveLineItems(context, this.claimDetails.lineItems);

    return true;
  }

  private validateRequest() {
    const validParams = this.projectId && this.partnerId && this.costCategoryId && this.periodId;
    const validDto = this.claimDetails.partnerId === this.partnerId && this.claimDetails.periodId === this.periodId && this.claimDetails.costCategoryId === this.costCategoryId;
    const validLineItems = this.claimDetails.lineItems.every(x => x.periodId === this.periodId && x.partnerId === this.partnerId && x.costCategoryId === this.costCategoryId);

    if (!validParams || !validDto || !validLineItems) {
      throw new BadRequestError("Request is missing required fields");
    }
  }

  private async saveLineItems(context: IContext, lineItems: ClaimLineItemDto[]) {
    const existingLineItems = await context.repositories.claimLineItems.getAllForCategory(this.partnerId, this.costCategoryId, this.periodId);

    const filtered = lineItems.filter(x => !!x.description || isNumber(x.value));

    const updateDtos = filtered.filter(item => !!item.id);
    const insertDtos = filtered.filter(item => !item.id);

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

    const deleteItems = existingLineItems.filter(x => !updateDtos.some(y => x.Id === y.id)).map(x => x.Id);

    await context.repositories.claimLineItems.delete(deleteItems);
    await context.repositories.claimLineItems.update(updateItems);
    await context.repositories.claimLineItems.insert(insertItems);
  }

  private async saveClaimDetail(context: IContext, claimDetail: ClaimDetailsDto) {
    const key: ClaimDetailKey = { projectId: this.projectId, partnerId: this.partnerId, periodId: this.periodId, costCategoryId: this.costCategoryId };
    const existing = await context.repositories.claimDetails.get(key);

    if (!existing) {
      context.logger.info("Creating new claim detail", key);
      await context.repositories.claimDetails.insert({
        Acc_ReasonForDifference__c: claimDetail.comments,
        Acc_ProjectParticipant__r: {
          Id: this.partnerId,
          Acc_ProjectId__c: this.projectId
        },
        Acc_ProjectPeriodNumber__c: this.periodId,
        Acc_CostCategory__c: this.costCategoryId,
        Acc_PeriodCostCategoryTotal__c: 0
      });
    }
    else if (existing.Acc_ReasonForDifference__c !== claimDetail.comments) {
      context.logger.info("Updating existing claim detail", key, existing.Id);
      await context.repositories.claimDetails.update({
        Id: existing.Id,
        Acc_ReasonForDifference__c: claimDetail.comments,
      });
    }
  }
}
