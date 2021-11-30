import { LoanDto } from "@framework/types";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { storeKeys } from "@ui/redux/stores/storeKeys";

import { LoansRequestParams, LoansRequestRoute, LoansSummaryRoute } from "@ui/containers";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { GetLoan } from "@server/features/loans/getLoan";
import { LoanDtoValidator } from "@ui/validators/loanValidator";
import { UpdateLoanCommand } from "@server/features/loans/updateLoanCommand";

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
    const originalLoanQuery = new GetLoan(true, params.projectId, params.loanId);
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
