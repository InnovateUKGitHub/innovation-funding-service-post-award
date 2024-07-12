import { IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { storeKeys } from "@server/features/common/storeKeys";
import { DeletePartnerDocumentCommand } from "@server/features/documents/deletePartnerDocument";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { configuration } from "@server/features/common/config";
import {
  ProjectSetupBankStatementParams,
  ProjectSetupBankStatementRoute,
} from "@ui/containers/pages/projects/setup/projectSetupBankStatement.page";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";

interface Document extends MultipleDocumentUploadDto {
  id: string;
}

export class BankSetupStatementDocumentDeleteHandler extends StandardFormHandlerBase<
  ProjectSetupBankStatementParams,
  MultipleDocumentUploadDto
> {
  constructor() {
    super(ProjectSetupBankStatementRoute, ["delete"]);
  }

  protected getDto(
    _context: IContext,
    _params: ProjectSetupBankStatementParams,
    button: IFormButton,
  ): Promise<MultipleDocumentUploadDto> {
    return Promise.resolve({ id: button.value, files: [] });
  }

  protected getStoreKey(params: ProjectSetupBankStatementParams) {
    return storeKeys.getPartnerKey(params.partnerId);
  }

  protected async run(
    context: IContext,
    params: ProjectSetupBankStatementParams,
    _button: IFormButton,
    dto: Document,
  ): Promise<ILinkInfo> {
    await context.runCommand(new DeletePartnerDocumentCommand(params.projectId, params.partnerId, dto.id));

    return ProjectSetupBankStatementRoute.getLink(params);
  }

  protected createValidationResult(params: ProjectSetupBankStatementParams, dto: Document) {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, false, false, null);
  }
}
