import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "./formHandlerBase";
import { getProjectDocumentEditor } from "../../ui/redux/selectors";
import { ProjectDocumentPageParams, ProjectDocumentsRoute } from "../../ui/containers";
import { UploadProjectDocumentCommand } from "../features/documents/uploadProjectDocument";
import { Configuration } from "@server/features/common";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { IContext, ILinkInfo } from "@framework/types";

export class ProjectDocumentUploadHandler extends MultipleFileFormHandlerBase<ProjectDocumentPageParams, "multipleDocuments"> {
  constructor() {
    super(ProjectDocumentsRoute, ["default"], "multipleDocuments");
  }

  protected getDto(context: IContext, params: ProjectDocumentPageParams, button: IFormButton, body: IFormBody, files: IFileWrapper[]): Promise<MultipleDocumentUploadDto> {
    return Promise.resolve({
      files,
      description: body.description
    });
  }

  protected async run(context: IContext, params: ProjectDocumentPageParams, button: IFormButton, dto: MultipleDocumentUploadDto): Promise<ILinkInfo> {
    await context.runCommand(new UploadProjectDocumentCommand(params.projectId, dto));
    return ProjectDocumentsRoute.getLink(params);
  }

  protected getStoreKey(params: ProjectDocumentPageParams) {
    return getProjectDocumentEditor(params.projectId).key;
  }

  protected createValidationResult(params: ProjectDocumentPageParams, dto: MultipleDocumentUploadDto): MultipleDocumentUpdloadDtoValidator {
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration, true, false);
  }
}
