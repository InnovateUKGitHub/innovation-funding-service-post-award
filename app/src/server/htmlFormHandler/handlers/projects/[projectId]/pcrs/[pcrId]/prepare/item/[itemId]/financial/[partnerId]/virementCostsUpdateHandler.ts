import { FinancialVirementDto } from "@framework/dtos/financialVirementDto";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { roundCurrency } from "@framework/util/numberHelper";
import { GetUnfilteredCostCategoriesQuery } from "@server/features/claims/getCostCategoriesQuery";
import { GetFinancialVirementQuery } from "@server/features/financialVirements/getFinancialVirementQuery";
import { UpdateFinancialVirementCommand } from "@server/features/financialVirements/updateFinancialVirementCommand";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { StandardFormHandlerBase, IFormButton, IFormBody } from "@server/htmlFormHandler/formHandlerBase";
import { BadRequestError } from "@shared/appError";
import {
  PartnerLevelFinancialVirementParams,
  PartnerLevelFinancialVirementRoute,
} from "@ui/containers/pages/pcrs/reallocateCosts/edit/costCategory/CostCategoryLevelFinancialVirementEdit.page";
import { PCRPrepareItemRoute } from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";
import { storeKeys } from "@server/features/common/storeKeys";
import { FinancialVirementDtoValidator } from "@ui/validation/validators/financialVirementDtoValidator";

export class VirementCostsUpdateHandler extends StandardFormHandlerBase<
  PartnerLevelFinancialVirementParams,
  FinancialVirementDto
> {
  constructor() {
    super(PartnerLevelFinancialVirementRoute, ["default"]);
  }

  protected async getDto(
    context: IContext,
    params: PartnerLevelFinancialVirementParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<FinancialVirementDto> {
    const virementQuery = new GetFinancialVirementQuery(params.projectId, params.itemId, params.partnerId);
    const virementDto = await context.runQuery(virementQuery);

    if (!virementDto) throw new BadRequestError("Virement not found");

    const partnerVirementDto = virementDto.partners.find(x => x.partnerId === params.partnerId);
    if (!partnerVirementDto) throw new BadRequestError("Partner virement not found");

    const partner = await context.runQuery(new GetByIdQuery(params.partnerId));
    const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());
    const calculatedCostCategoryIds = costCategories.filter(y => y.isCalculated).map(y => y.id) || [];

    partnerVirementDto.virements.forEach(x => {
      // Check if the costCategoryId is in the submitted body.
      if (!body.hasOwnProperty(x.costCategoryId)) return;

      const newEligibleCosts = parseFloat(body[x.costCategoryId]);
      x.newEligibleCosts = newEligibleCosts;

      if (partner.overheadRate) {
        const related = partnerVirementDto.virements.find(
          v => calculatedCostCategoryIds.indexOf(v.costCategoryId) !== -1,
        );

        if (related) {
          related.newEligibleCosts = roundCurrency((newEligibleCosts || 0) * (partner.overheadRate / 100));
        }
      }
    });

    return virementDto;
  }

  protected async run(
    context: IContext,
    { projectId, itemId, pcrId }: PartnerLevelFinancialVirementParams,
    button: IFormButton,
    dto: FinancialVirementDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(new UpdateFinancialVirementCommand(projectId, pcrId, itemId, dto, false));
    return PCRPrepareItemRoute.getLink({ projectId, pcrId, itemId });
  }

  protected getStoreKey({ projectId, itemId, pcrId, partnerId }: PartnerLevelFinancialVirementParams) {
    return storeKeys.getFinancialVirementKey(projectId, pcrId, itemId, partnerId);
  }

  protected createValidationResult(params: PartnerLevelFinancialVirementParams, dto: FinancialVirementDto) {
    return new FinancialVirementDtoValidator({ model: dto, showValidationErrors: false, submit: false });
  }
}
