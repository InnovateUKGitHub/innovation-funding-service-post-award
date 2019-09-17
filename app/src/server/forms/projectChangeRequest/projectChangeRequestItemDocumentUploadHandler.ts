import { IContext, ILinkInfo } from "@framework/types";
import { Configuration } from "@server/features/common";
import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/forms/formHandlerBase";
import { ProjectChangeRequestPrepareItemParams, ProjectChangeRequestPrepareItemRoute } from "@ui/containers";
import { getProjectChangeRequestDocumentOrItemDocumentEditor } from "@ui/redux/selectors";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";

export class ProjectChangeRequestItemDocumentUploadHandler extends MultipleFileFormHandlerBase<ProjectChangeRequestPrepareItemParams, MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator> {
  constructor() {
    super(ProjectChangeRequestPrepareItemRoute, ["uploadFile"]);
  }

  protected async getDto(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, body: IFormBody, files: IFileWrapper[]): Promise<MultipleDocumentUploadDto> {
    return {
      files,
      description: body.description
    };
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, dto: MultipleDocumentUploadDto): Promise<ILinkInfo> {
    await context.runCommand(new UploadProjectChangeRequestDocumentOrItemDocumentCommand(params.projectId, params.itemId, dto));

    return ProjectChangeRequestPrepareItemRoute.getLink(params);
  }

  protected getStoreInfo(params: ProjectChangeRequestPrepareItemParams): { key: string, store: string } {
    return getProjectChangeRequestDocumentOrItemDocumentEditor(params.itemId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareItemParams, dto: MultipleDocumentUploadDto) {
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration, true);
  }
}
