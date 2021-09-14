import { configuration } from "@server/features/common";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators";
import { DocumentDescription, IContext, IFileWrapper, ILinkInfo } from "@framework/types";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { ProjectSetupBankStatementParams, ProjectSetupBankStatementRoute } from "@ui/containers";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/forms/formHandlerBase";
import { UploadPartnerDocumentCommand } from "@server/features/documents/uploadPartnerDocument";

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
      description: DocumentDescription.BankStatement
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
