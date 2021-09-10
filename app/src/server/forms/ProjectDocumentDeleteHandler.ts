import { IContext, ILinkInfo } from "@framework/types";
import { MultipleDocumentUploadDto } from "@framework/dtos";

import { configuration } from "@server/features/common";
import { IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { DeleteProjectDocumentCommand } from "@server/features/documents/deleteProjectDocument";

import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators";

import { ProjectDocumentPageParams, ProjectDocumentsRoute } from "@ui/containers";

interface Document extends MultipleDocumentUploadDto {
  id: string;
}

export class ProjectDocumentDeleteHandler extends StandardFormHandlerBase<
  ProjectDocumentPageParams,
  "multipleDocuments"
> {
  constructor() {
    super(ProjectDocumentsRoute, ["delete"], "multipleDocuments");
  }

  protected getDto(context: IContext, params: ProjectDocumentPageParams, button: IFormButton) {
    return Promise.resolve({ id: button.value, files: [] });
  }

  protected getStoreKey(params: ProjectDocumentPageParams) {
    return storeKeys.getProjectKey(params.projectId);
  }

  protected async run(
    context: IContext,
    params: ProjectDocumentPageParams,
    button: IFormButton,
    dto: Document,
  ): Promise<ILinkInfo> {
    await context.runCommand(new DeleteProjectDocumentCommand(params.projectId, dto.id));

    return ProjectDocumentsRoute.getLink(params);
  }

  protected createValidationResult(params: ProjectDocumentPageParams, dto: Document) {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, false, false, null);
  }
}
