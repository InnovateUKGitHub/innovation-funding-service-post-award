import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "./formHandlerBase";
import { ProjectDocumentPageParams, ProjectDocumentsRoute } from "../../ui/containers";
import { UploadProjectDocumentCommand } from "../features/documents/uploadProjectDocument";
import { Configuration } from "@server/features/common";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { DocumentDescription, IContext, ILinkInfo } from "@framework/types";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

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
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration, true, false, null);
  }
}
