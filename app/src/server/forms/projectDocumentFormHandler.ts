import { FormHandlerBase, IFormBody, IFormButton } from "./formHandlerBase";
import { getProjectDocumentEditor } from "../../ui/redux/selectors";
import { ProjectDocumentPageParams, ProjectDocumentsRoute } from "../../ui/containers";
import { UploadProjectDocumentCommand } from "../features/documents/uploadProjectDocument";
import { upload } from "./memoryStorage";
import { Configuration } from "@server/features/common";
import { DocumentUploadDtoValidator } from "@ui/validators";
import { IContext, ILinkInfo } from "@framework/types";

export class ProjectDocumentUploadHandler extends FormHandlerBase<ProjectDocumentPageParams, DocumentUploadDto, DocumentUploadDtoValidator> {
  constructor() {
    super(ProjectDocumentsRoute, ["default"], [upload.single("attachment")]);
  }

  protected async getDto(context: IContext, params: ProjectDocumentPageParams, button: IFormButton, body: IFormBody, file: IFileWrapper): Promise<DocumentUploadDto> {
    return {
      file
    };
  }

  protected async run(context: IContext, params: ProjectDocumentPageParams, button: IFormButton, dto: DocumentUploadDto): Promise<ILinkInfo> {
    await context.runCommand(new UploadProjectDocumentCommand(params.projectId, dto));
    return ProjectDocumentsRoute.getLink(params);
  }

  protected getStoreInfo(params: ProjectDocumentPageParams): { key: string, store: string } {
    return getProjectDocumentEditor(params.projectId, Configuration.maxFileSize);
  }

  protected createValidationResult(params: ProjectDocumentPageParams, dto: DocumentUploadDto) {
    return new DocumentUploadDtoValidator(dto, Configuration.maxFileSize, false);
  }
}
