import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { DeleteProjectDocumentCommand } from "@server/features/documents/deleteProjectDocument";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { DocumentDeleteDto } from "@framework/dtos/documentDeleteDto";
import { DeletePartnerDocumentCommand } from "@server/features/documents/deletePartnerDocument";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { configuration } from "@server/features/common/config";
import {
  ProjectDocumentPageParams,
  ProjectDocumentsRoute,
} from "@ui/containers/projects/documents/projectDocuments.page";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";

export class ProjectDocumentDeleteHandler extends StandardFormHandlerBase<
  ProjectDocumentPageParams,
  "multipleDocuments"
> {
  constructor() {
    super(ProjectDocumentsRoute, ["delete"], "multipleDocuments");
  }

  protected async getDto(
    context: IContext,
    params: ProjectDocumentPageParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<DocumentDeleteDto> {
    return { documentId: button.value, files: [], partnerId: body.partnerId };
  }

  protected getStoreKey(params: ProjectDocumentPageParams) {
    return storeKeys.getProjectKey(params.projectId);
  }

  protected async run(
    context: IContext,
    params: ProjectDocumentPageParams,
    button: IFormButton,
    dto: DocumentDeleteDto,
  ): Promise<ILinkInfo> {
    if (dto.partnerId) {
      await context.runCommand(new DeletePartnerDocumentCommand(params.projectId, dto.partnerId, dto.documentId));
    } else {
      await context.runCommand(new DeleteProjectDocumentCommand(params.projectId, dto.documentId));
    }

    return ProjectDocumentsRoute.getLink(params);
  }

  protected createValidationResult(params: ProjectDocumentPageParams, dto: DocumentDeleteDto) {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, false, false, null);
  }
}
