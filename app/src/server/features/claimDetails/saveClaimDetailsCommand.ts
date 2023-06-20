import { ProjectRole } from "@framework/constants/project";
import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { ClaimLineItemDto } from "@framework/dtos/claimLineItemDto";
import { Authorisation } from "@framework/types/authorisation";
import { ClaimDetailKey } from "@framework/types/ClaimDetailKey";
import { IContext } from "@framework/types/IContext";
import { isNumber } from "@framework/util/numberHelper";
import { ISalesforceClaimLineItem } from "@server/repositories/claimLineItemRepository";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { ClaimDetailsValidator } from "@ui/validators/claimDetailsValidator";
import { GetUnfilteredCostCategoriesQuery } from "../claims/getCostCategoriesQuery";
import { BadRequestError, InActiveProjectError, ValidationError } from "../common/appError";
import { CommandBase } from "../common/commandBase";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";

export class SaveClaimDetails extends CommandBase<boolean> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly partnerId: PartnerId,
    private readonly periodId: number,
    private readonly costCategoryId: string,
    private readonly claimDetails: ClaimDetailsDto,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected async run(context: IContext) {
    await this.validateRequest(context);

    const costCategoryQuery = new GetUnfilteredCostCategoriesQuery();
    const costCategories = await context.runQuery(costCategoryQuery);
    const costCategory = costCategories.find(y => y.id === this.costCategoryId);

    if (!costCategory) {
      throw new BadRequestError("Invalid cost category specified");
    } else if (costCategory.isCalculated) {
      throw new BadRequestError("Invalid calculated cost category specified");
    }

    const validationResult = new ClaimDetailsValidator({ model: this.claimDetails, showValidationErrors: true });
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    await this.saveClaimDetail(context, this.claimDetails);
    await this.saveLineItems(context, this.claimDetails.lineItems);

    return true;
  }

  private async validateRequest(context: IContext): Promise<void> {
    const validParams = this.projectId && this.partnerId && this.costCategoryId && this.periodId;

    const validClaimByPartnerId = this.claimDetails.partnerId === this.partnerId;
    const validClaimByPeriodId = this.claimDetails.periodId === this.periodId;
    const validClaimByCostCategoryId = this.claimDetails.costCategoryId === this.costCategoryId;

    const validDto = validClaimByPartnerId && validClaimByPeriodId && validClaimByCostCategoryId;

    const validLineItems = this.claimDetails.lineItems.every(x => {
      const isValidPeriodId = x.periodId === this.periodId;
      const isValidPartnerId = x.partnerId === this.partnerId;
      const isValidCostCategoryId = x.costCategoryId === this.costCategoryId;

      return isValidPeriodId && isValidPartnerId && isValidCostCategoryId;
    });

    if (!validParams || !validDto || !validLineItems) {
      throw new BadRequestError("Request is missing required fields");
    }

    const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.projectId));

    if (!isProjectActive) {
      throw new InActiveProjectError();
    }
  }

  private async saveLineItems(context: IContext, lineItems: ClaimLineItemDto[]) {
    const existingLineItems = await context.repositories.claimLineItems.getAllForCategory(
      this.partnerId,
      this.costCategoryId,
      this.periodId,
    );

    const filtered = lineItems.filter(x => !!x.description || isNumber(x.value));

    const updateDtos = filtered.filter(item => !!item.id);

    const insertDtos = filtered.filter(item => !item.id);

    const updateItems: Updatable<ISalesforceClaimLineItem>[] = updateDtos
      .filter(x => {
        const originalItem = existingLineItems.find(original => original.Id === x.id);

        if (!originalItem) throw new BadRequestError("Line item not found");

        const hasValueChanged = originalItem.Acc_LineItemCost__c !== x.value;
        const hasDescriptionChanged = originalItem.Acc_LineItemDescription__c !== x.description;

        // If line item is unchanged then don't include it in the updates
        return hasValueChanged || hasDescriptionChanged;
      })
      .map(x => ({
        Id: x.id,
        Acc_LineItemDescription__c: x.description,
        Acc_LineItemCost__c: x.value,
      }));

    const insertItems: Partial<ISalesforceClaimLineItem>[] = insertDtos.map(x => ({
      Acc_LineItemDescription__c: x.description,
      Acc_LineItemCost__c: x.value,
      Acc_ProjectParticipant__c: x.partnerId,
      Acc_ProjectPeriodNumber__c: x.periodId,
      Acc_CostCategory__c: x.costCategoryId,
    }));

    const deleteItems = existingLineItems.filter(x => !updateDtos.some(y => x.Id === y.id)).map(x => x.Id);

    await context.repositories.claimLineItems.delete(deleteItems);
    await context.repositories.claimLineItems.update(updateItems);
    await context.repositories.claimLineItems.insert(insertItems);
  }

  private async saveClaimDetail(context: IContext, claimDetail: ClaimDetailsDto) {
    const key: ClaimDetailKey = {
      projectId: this.projectId,
      partnerId: this.partnerId,
      periodId: this.periodId,
      costCategoryId: this.costCategoryId,
    };
    const existing = await context.repositories.claimDetails.get(key);

    if (!existing) {
      context.logger.info("Creating new claim detail", key);
      await context.repositories.claimDetails.insert({
        Acc_ReasonForDifference__c: claimDetail.comments,
        Acc_ProjectParticipant__r: {
          Id: this.partnerId,
          Acc_ProjectId__c: this.projectId,
        },
        Acc_ProjectPeriodNumber__c: this.periodId,
        Acc_CostCategory__c: this.costCategoryId,
        Acc_PeriodCostCategoryTotal__c: 0,
      });
    } else if (existing.Acc_ReasonForDifference__c !== claimDetail.comments) {
      context.logger.info("Updating existing claim detail", key, existing.Id);
      await context.repositories.claimDetails.update({
        Id: existing.Id,
        Acc_ReasonForDifference__c: claimDetail.comments,
      });
    }
  }
}
