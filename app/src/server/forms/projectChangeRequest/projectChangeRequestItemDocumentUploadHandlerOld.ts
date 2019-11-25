import { IContext, ILinkInfo } from "@framework/types";
import { Configuration } from "@server/features/common";
import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  ProjectChangeRequestPrepareItemFilesRoute,
  ProjectChangeRequestPrepareItemParams
} from "@ui/containers";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { getKey } from "@framework/util";

export class ProjectChangeRequestItemDocumentUploadHandlerOld extends MultipleFileFormHandlerBase<ProjectChangeRequestPrepareItemParams, MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator> {
  constructor() {
    super(ProjectChangeRequestPrepareItemFilesRoute, ["uploadFile"]);
  }

  protected async getDto(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, body: IFormBody, files: IFileWrapper[]): Promise<MultipleDocumentUploadDto> {
    return {
      files,
      description: body.description
    };
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, dto: MultipleDocumentUploadDto): Promise<ILinkInfo> {
    await context.runCommand(new UploadProjectChangeRequestDocumentOrItemDocumentCommand(params.projectId, params.itemId, dto));

    return ProjectChangeRequestPrepareItemFilesRoute.getLink(params);
  }

  protected getStoreInfo(params: ProjectChangeRequestPrepareItemParams): { key: string, store: string } {
    return {
      key: getKey("pcrs", params.projectId, params.itemId),
      store:"multipleDocuments"
    };
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareItemParams, dto: MultipleDocumentUploadDto) {
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration, true, true);
  }
}
