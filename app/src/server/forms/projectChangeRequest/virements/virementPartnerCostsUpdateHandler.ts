import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { FinancialVirementEditPartnerLevelRoute, FinancialVirementParams, PCRPrepareItemRoute, VirementCostsParams } from "@ui/containers";
import { IContext, ILinkInfo } from "@framework/types";
import { GetFinancialVirementQuery } from "@server/features/financialVirements/getFinancialVirementQuery";
import { BadRequestError } from "@server/features/common";
import { UpdateFinancialVirementCommand } from "@server/features/financialVirements/updateFinancialVirementCommand";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { FinancialVirementDtoValidator } from "@ui/validators";

export class VirementPartnerCostsUpdateHandler extends StandardFormHandlerBase<FinancialVirementParams, "financialVirement"> {
  constructor() {
    super(FinancialVirementEditPartnerLevelRoute, ["default"], "financialVirement");
  }

  protected async getDto(context: IContext, params: FinancialVirementParams, button: IFormButton, body: IFormBody): Promise<FinancialVirementDto> {
    const virementDto = await context.runQuery(new GetFinancialVirementQuery(params.projectId, params.pcrId, params.itemId));
    if (!virementDto) {
      throw new BadRequestError("Virement not found");
    }

    virementDto.partners.forEach(partner => {
      if (!body.hasOwnProperty(partner.partnerId)) return;

      const val = parseFloat(body[partner.partnerId]);
      partner.newRemainingGrant = val;
      partner.newFundingLevel = 100 * (val || 0) / partner.newRemainingCosts;
    });

    virementDto.newRemainingGrant = virementDto.partners.reduce((total, current) => total + (current.newRemainingGrant || 0), 0);
    virementDto.newFundingLevel = 100 * virementDto.newRemainingGrant / virementDto.newRemainingCosts;

    return virementDto;
  }

  protected async run(context: IContext, { projectId, itemId, pcrId }: VirementCostsParams, button: IFormButton, dto: FinancialVirementDto): Promise<ILinkInfo> {
    await context.runCommand(new UpdateFinancialVirementCommand(projectId, pcrId, itemId, dto, true));
    return PCRPrepareItemRoute.getLink({ projectId, pcrId, itemId });
  }

  protected getStoreKey({ projectId, itemId, pcrId }: VirementCostsParams) {
    return storeKeys.getFinancialVirementKey(projectId, pcrId, itemId);
  }

  protected createValidationResult(params: VirementCostsParams, dto: FinancialVirementDto) {
    return new FinancialVirementDtoValidator(dto, false, true);
  }
}
