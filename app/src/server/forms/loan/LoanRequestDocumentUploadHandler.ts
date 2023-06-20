import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/forms/formHandlerBase";
import { UploadLoanDocumentsCommand } from "@server/features/documents/uploadLoanDocument";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { IFileWrapper } from "@framework/types/fileWapper";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { configuration } from "@server/features/common/config";
import { LoansRequestParams, LoansRequestRoute } from "@ui/containers/loans/request.page";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";

export class LoanRequestDocumentUploadHandler extends MultipleFileFormHandlerBase<
  LoansRequestParams,
  "multipleDocuments"
> {
  constructor() {
    super(LoansRequestRoute, ["loan-document-upload"], "multipleDocuments");
  }

  protected getDto(
    _context: IContext,
    _params: LoansRequestParams,
    _button: IFormButton,
    _body: IFormBody,
    files: IFileWrapper[],
  ): Promise<MultipleDocumentUploadDto> {
    return Promise.resolve({
      files,
      description: DocumentDescription.Loan,
    });
  }

  protected async run(
    context: IContext,
    params: LoansRequestParams,
    _button: IFormButton,
    dto: MultipleDocumentUploadDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(new UploadLoanDocumentsCommand(dto, params.projectId, params.loanId));

    return LoansRequestRoute.getLink(params);
  }

  protected getStoreKey(params: LoansRequestParams) {
    return storeKeys.getLoanKey(params.projectId, params.loanId);
  }

  protected createValidationResult(
    _params: LoansRequestParams,
    dto: MultipleDocumentUploadDto,
  ): MultipleDocumentUploadDtoValidator {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, true, false, null);
  }
}
