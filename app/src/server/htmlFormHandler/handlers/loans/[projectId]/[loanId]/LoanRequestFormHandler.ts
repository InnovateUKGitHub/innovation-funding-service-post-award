import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { GetLoan } from "@server/features/loans/getLoan";
import { LoanDtoValidator } from "@ui/validation/validators/loanValidator";
import { UpdateLoanCommand } from "@server/features/loans/updateLoanCommand";
import { LoanDto } from "@framework/dtos/loanDto";
import { LoansSummaryRoute } from "@ui/containers/pages/loans/overview.page";
import { LoansRequestParams, LoansRequestRoute } from "@ui/containers/pages/loans/request.page";

export class LoanRequestFormHandler extends StandardFormHandlerBase<LoansRequestParams, "loan"> {
  constructor() {
    super(LoansRequestRoute, ["default"], "loan");
  }

  protected async getDto(
    context: IContext,
    params: LoansRequestParams,
    _button: IFormButton,
    body: IFormBody,
  ): Promise<LoanDto> {
    const originalLoanQuery = new GetLoan(params.projectId, { loanId: params.loanId });
    const originalLoan = await context.runQuery(originalLoanQuery);

    return {
      ...originalLoan,
      comments: body.comments,
    };
  }

  protected async run(
    context: IContext,
    params: LoansRequestParams,
    _button: IFormButton,
    dto: LoanDto,
  ): Promise<ILinkInfo> {
    const updateLoanQuery = new UpdateLoanCommand(params.projectId, params.loanId, dto);
    await context.runCommand(updateLoanQuery);

    return LoansSummaryRoute.getLink(params);
  }

  protected getStoreKey(params: LoansRequestParams) {
    return storeKeys.getLoanKey(params.projectId, params.loanId);
  }

  protected createValidationResult(_params: LoansRequestParams, dto: LoanDto) {
    return new LoanDtoValidator(dto, [], false);
  }
}
