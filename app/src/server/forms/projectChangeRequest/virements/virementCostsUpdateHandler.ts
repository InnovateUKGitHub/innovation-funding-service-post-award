import { IContext, ILinkInfo } from "@framework/types";
import { BadRequestError } from "@server/features/common";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { FinancialVirementEditRoute, PCRPrepareItemRoute, VirementCostsParams } from "@ui/containers";
import { FinancialVirementDtoValidator } from "@ui/validators";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { GetFinancialVirementQuery } from "@server/features/financialVirements/getFinancialVirementQuery";
import { UpdateFinancialVirementCommand } from "@server/features/financialVirements/updateFinancialVirementCommand";
import { roundCurrency } from "@framework/util";
import { GetCostCategoriesQuery } from "@server/features/claims";
import { GetByIdQuery } from "@server/features/partners";

export class VirementCostsUpdateHandler extends StandardFormHandlerBase<VirementCostsParams, "financialVirement"> {
  constructor() {
    super(FinancialVirementEditRoute, ["default"], "financialVirement");
  }

  protected async getDto(context: IContext, params: VirementCostsParams, button: IFormButton, body: IFormBody): Promise<FinancialVirementDto> {
    const virementDto = await context.runQuery(new GetFinancialVirementQuery(params.projectId, params.pcrId, params.itemId));
    if (!virementDto) {
      throw new BadRequestError("Virement not found");
    }

    const partnerVirementDto = virementDto.partners.find(x => x.partnerId === params.partnerId);
    if (!partnerVirementDto) {
      throw new BadRequestError("Partner virement not found");
    }

    const partner = await context.runQuery(new GetByIdQuery(params.partnerId));
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    const calculatedCostCategoryIds = costCategories.filter(y => y.isCalculated).map(y => y.id) || [];

    partnerVirementDto.virements.forEach(x => {
      if (!body.hasOwnProperty(x.costCategoryId)) return;

      const newEligibleCosts = parseFloat(body[x.costCategoryId]);
      x.newEligibleCosts = newEligibleCosts;

      if (partner.overheadRate) {
        const related = partnerVirementDto.virements.find(v => calculatedCostCategoryIds.indexOf(v.costCategoryId) !== -1);
        if (related) {
          related.newEligibleCosts = roundCurrency((newEligibleCosts || 0) * (partner.overheadRate / 100));
        }
      }
    });

    return virementDto;
  }

  protected async run(context: IContext, { projectId, itemId, partnerId, pcrId }: VirementCostsParams, button: IFormButton, dto: FinancialVirementDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdateFinancialVirementCommand(projectId, pcrId, itemId, dto, false));
    return PCRPrepareItemRoute.getLink({ projectId, pcrId, itemId });
  }

  protected getStoreKey({ projectId, itemId, partnerId, pcrId }: VirementCostsParams) {
    return storeKeys.getFinancialVirementKey(projectId, pcrId, itemId);
  }

  protected createValidationResult(params: VirementCostsParams, dto: FinancialVirementDto) {
    return new FinancialVirementDtoValidator(dto, false, false);
  }
}
