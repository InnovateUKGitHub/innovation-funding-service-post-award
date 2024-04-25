import { IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { DeleteLoanDocument } from "@server/features/documents/deleteLoanDocument";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { configuration } from "@server/features/common/config";
import { LoansRequestParams, LoansRequestRoute } from "@ui/containers/pages/loans/loanRequest.page";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

interface Document extends MultipleDocumentUploadDto {
  id: string;
}

export class LoanRequestDocumentDeleteHandler extends StandardFormHandlerBase<LoansRequestParams, "multipleDocuments"> {
  constructor() {
    super(LoansRequestRoute, ["delete"], "multipleDocuments");
  }

  protected getDto(_context: IContext, _params: LoansRequestParams, button: IFormButton) {
    return Promise.resolve({ id: button.value, files: [] });
  }

  protected getStoreKey(params: LoansRequestParams) {
    return storeKeys.getLoanKey(params.projectId, params.loanId);
  }

  protected async run(
    context: IContext,
    params: LoansRequestParams,
    _button: IFormButton,
    dto: Document,
  ): Promise<ILinkInfo> {
    await context.runCommand(new DeleteLoanDocument(dto.id, params.projectId, params.loanId));

    return LoansRequestRoute.getLink(params);
  }

  protected createValidationResult(params: LoansRequestParams, dto: Document) {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, false, false, null);
  }
}
