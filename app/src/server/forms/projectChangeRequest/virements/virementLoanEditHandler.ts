import { FinancialLoanVirementDto } from "@framework/dtos/financialVirementDto";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { GetFinancialLoanVirementQuery } from "@server/features/financialVirements/getFinancialLoanVirementQuery";
import { UpdateFinancialLoanVirementCommand } from "@server/features/financialVirements/updateFinancialLoanVirementCommand";
import { StandardFormHandlerBase, IFormButton, IFormBody } from "@server/forms/formHandlerBase";
import { BadRequestError } from "@shared/appError";
import { VirementCostsParams } from "@ui/containers/pcrs/financialVirements/editPage";
import { FinancialVirementParams } from "@ui/containers/pcrs/financialVirements/editPartnerLevel.page";
import { PCRPrepareItemRoute } from "@ui/containers/pcrs/pcrItemWorkflow";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { FinancialLoanVirementDtoValidator } from "@ui/validators/financialVirementDtoValidator";

export class VirementLoanEditHandler extends StandardFormHandlerBase<FinancialVirementParams, "financialLoanVirement"> {
  constructor() {
    super(PCRPrepareItemRoute, ["loanEdit"], "financialLoanVirement");
  }

  protected async getDto(
    context: IContext,
    params: FinancialVirementParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<FinancialLoanVirementDto> {
    const virementDto = await context.runQuery(new GetFinancialLoanVirementQuery(params.projectId, params.itemId));

    if (!virementDto) {
      throw new BadRequestError("Virement not found");
    }

    const latestVirement = virementDto.loans.map(loan => {
      if (!loan.isEditable) return loan;

      const rawNewValue = body[`${loan.period}_newValue`];

      const rawNewDateDay = body[`${loan.period}_newDate_day`];
      const rawNewDateMonth = body[`${loan.period}_newDate_month`];
      const rawNewDateYear = body[`${loan.period}_newDate_year`];

      const rawNewDateYMD = `${rawNewDateYear}-${rawNewDateMonth}-${rawNewDateDay}`;

      const newDate = context.clock.parseRequiredSalesforceDateTime(rawNewDateYMD);
      const newValue = Number(rawNewValue);

      return {
        ...loan,
        newDate,
        newValue,
      };
    }, []);

    return {
      ...virementDto,
      loans: latestVirement,
    };
  }

  protected async run(
    context: IContext,
    { projectId, itemId, pcrId }: VirementCostsParams,
    button: IFormButton,
    dto: FinancialLoanVirementDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(new UpdateFinancialLoanVirementCommand(projectId, itemId, dto, false));
    return PCRPrepareItemRoute.getLink({ projectId, pcrId, itemId });
  }

  protected getStoreKey({ projectId, itemId, pcrId }: VirementCostsParams) {
    return storeKeys.getFinancialVirementKey(projectId, pcrId, itemId);
  }

  protected createValidationResult(params: VirementCostsParams, dto: FinancialLoanVirementDto) {
    return new FinancialLoanVirementDtoValidator(dto, false, true);
  }
}
