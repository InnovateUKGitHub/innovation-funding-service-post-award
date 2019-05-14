import { FormHandlerBase, IFormBody, IFormButton } from "./formHandlerBase";
import { getProjectDocumentEditor } from "../../ui/redux/selectors";
import { Results } from "../../ui/validation/results";
import { ProjectDocumentPageParams, ProjectDocumentsRoute } from "../../ui/containers";
import { UploadProjectDocumentCommand } from "../features/documents/uploadProjectDocument";
import { upload } from "./memoryStorage";
import { FileUpload, IContext, ILinkInfo } from "@framework/types";

export class ProjectDocumentUploadHandler extends FormHandlerBase<ProjectDocumentPageParams, FileUpload> {
  constructor() {
    super(ProjectDocumentsRoute, ["default"], [upload.single("attachment")]);
  }

  protected async getDto(context: IContext, params: ProjectDocumentPageParams, button: IFormButton, body: IFormBody, file: FileUpload): Promise<FileUpload> {
    return file;
  }

  protected async run(context: IContext, params: ProjectDocumentPageParams, button: IFormButton, dto: FileUpload): Promise<ILinkInfo> {
    await context.runCommand(new UploadProjectDocumentCommand(params.projectId, dto));
    return ProjectDocumentsRoute.getLink(params);
  }

  protected getStoreInfo(params: ProjectDocumentPageParams): { key: string, store: string } {
    return getProjectDocumentEditor(params.projectId);
  }

  protected createValidationResult(params: ProjectDocumentPageParams, dto: FileUpload): Results<FileUpload> {
    return new Results(dto, false);
  }
}
