import { IContext, ILinkInfo } from "@framework/types";
import { MultipleDocumentUploadDto } from "@framework/dtos";

import { configuration } from "@server/features/common";
import { IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";

import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators";

import { ProjectSetupBankStatementParams, ProjectSetupBankStatementRoute } from "@ui/containers";
import { DeletePartnerDocumentCommand } from "@server/features/documents/deletePartnerDocument";

interface Document extends MultipleDocumentUploadDto {
  id: string;
}

export class BankSetupStatementDocumentDeleteHandler extends StandardFormHandlerBase<
  ProjectSetupBankStatementParams,
  "multipleDocuments"
> {
  constructor() {
    super(ProjectSetupBankStatementRoute, ["delete"], "multipleDocuments");
  }

  protected getDto(_context: IContext, _params: ProjectSetupBankStatementParams, button: IFormButton) {
    return Promise.resolve({ id: button.value, files: [] });
  }

  protected getStoreKey(params: ProjectSetupBankStatementParams) {
    return storeKeys.getProjectKey(params.projectId);
  }

  protected async run(
    context: IContext,
    params: ProjectSetupBankStatementParams,
    _button: IFormButton,
    dto: Document,
  ): Promise<ILinkInfo> {
    await context.runCommand(new DeletePartnerDocumentCommand(dto.id, params.projectId, params.partnerId));

    return ProjectSetupBankStatementRoute.getLink(params);
  }

  protected createValidationResult(params: ProjectSetupBankStatementParams, dto: Document) {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, false, false, null);
  }
}
