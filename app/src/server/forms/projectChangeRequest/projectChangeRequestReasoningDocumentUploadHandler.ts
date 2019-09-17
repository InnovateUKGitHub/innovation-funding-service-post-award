import { IContext, ILinkInfo } from "@framework/types";
import { Configuration } from "@server/features/common";
import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/forms/formHandlerBase";
import { ProjectChangeRequestPrepareReasoningParams, ProjectChangeRequestPrepareReasoningRoute } from "@ui/containers";
import { getProjectChangeRequestDocumentOrItemDocumentEditor } from "@ui/redux/selectors";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";

export class ProjectChangeRequestReasoningDocumentUploadHandler extends MultipleFileFormHandlerBase<ProjectChangeRequestPrepareReasoningParams, MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator> {
  constructor() {
    super(ProjectChangeRequestPrepareReasoningRoute, ["uploadFile"]);
  }

  protected async getDto(context: IContext, params: ProjectChangeRequestPrepareReasoningParams, button: IFormButton, body: IFormBody, files: IFileWrapper[]): Promise<MultipleDocumentUploadDto> {
    return {
      files,
      description: body.description
    };
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareReasoningParams, button: IFormButton, dto: MultipleDocumentUploadDto): Promise<ILinkInfo> {
    await context.runCommand(new UploadProjectChangeRequestDocumentOrItemDocumentCommand(params.projectId, params.pcrId, dto));

    return ProjectChangeRequestPrepareReasoningRoute.getLink(params);
  }

  protected getStoreInfo(params: ProjectChangeRequestPrepareReasoningParams): { key: string, store: string } {
    return getProjectChangeRequestDocumentOrItemDocumentEditor(params.pcrId);
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareReasoningParams, dto: MultipleDocumentUploadDto) {
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration, true);
  }
}
