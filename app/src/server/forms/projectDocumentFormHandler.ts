import { configuration } from "@server/features/common";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { IContext, IFileWrapper, ILinkInfo } from "@framework/types";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { UploadProjectDocumentCommand } from "../features/documents/uploadProjectDocument";
import { ProjectDocumentPageParams, ProjectDocumentsRoute } from "../../ui/containers";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "./formHandlerBase";

export class ProjectDocumentUploadHandler extends MultipleFileFormHandlerBase<ProjectDocumentPageParams, "multipleDocuments"> {
  constructor() {
    super(ProjectDocumentsRoute, ["default"], "multipleDocuments");
  }

  protected getDto(context: IContext, params: ProjectDocumentPageParams, button: IFormButton, body: IFormBody, files: IFileWrapper[]): Promise<MultipleDocumentUploadDto> {
    return Promise.resolve({
      files,
      description: parseInt(body.description, 10)
    });
  }

  protected async run(context: IContext, params: ProjectDocumentPageParams, button: IFormButton, dto: MultipleDocumentUploadDto): Promise<ILinkInfo> {
    await context.runCommand(new UploadProjectDocumentCommand(params.projectId, dto));
    return ProjectDocumentsRoute.getLink(params);
  }

  protected getStoreKey(params: ProjectDocumentPageParams) {
    return storeKeys.getProjectKey(params.projectId);
  }

  protected createValidationResult(params: ProjectDocumentPageParams, dto: MultipleDocumentUploadDto): MultipleDocumentUpdloadDtoValidator {
    return new MultipleDocumentUpdloadDtoValidator(dto, configuration.options, true, false, null);
  }
}
