import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { UploadPartnerDocumentCommand } from "@server/features/documents/uploadPartnerDocument";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { IFileWrapper } from "@framework/types/fileWapper";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { configuration } from "@server/features/common/config";
import {
  ProjectSetupBankStatementParams,
  ProjectSetupBankStatementRoute,
} from "@ui/containers/pages/projects/setup/projectSetupBankStatement.page";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";

export class BankSetupStatementDocumentUploadHandler extends MultipleFileFormHandlerBase<
  ProjectSetupBankStatementParams,
  "multipleDocuments"
> {
  constructor() {
    super(ProjectSetupBankStatementRoute, ["uploadFile"], "multipleDocuments");
  }

  protected getDto(
    _context: IContext,
    _params: ProjectSetupBankStatementParams,
    _button: IFormButton,
    _body: IFormBody,
    files: IFileWrapper[],
  ): Promise<MultipleDocumentUploadDto> {
    return Promise.resolve({
      files,
      description: DocumentDescription.BankStatement,
    });
  }

  protected async run(
    context: IContext,
    params: ProjectSetupBankStatementParams,
    _button: IFormButton,
    dto: MultipleDocumentUploadDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(new UploadPartnerDocumentCommand(params.projectId, params.partnerId, dto));

    return ProjectSetupBankStatementRoute.getLink(params);
  }

  protected getStoreKey(params: ProjectSetupBankStatementParams) {
    return storeKeys.getPartnerKey(params.partnerId);
  }

  protected createValidationResult(
    _params: ProjectSetupBankStatementParams,
    dto: MultipleDocumentUploadDto,
  ): MultipleDocumentUploadDtoValidator {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, true, false, null);
  }
}
