import { FormHandlerBase, IFormBody, IFormButton } from "./formHandlerBase";
import { getProjectDocumentEditor } from "../../ui/redux/selectors";
import { ProjectDocumentPageParams, ProjectDocumentsRoute } from "../../ui/containers";
import { UploadProjectDocumentCommand } from "../features/documents/uploadProjectDocument";
import { upload } from "./memoryStorage";
import { Configuration } from "@server/features/common";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { IContext, ILinkInfo } from "@framework/types";

export class ProjectDocumentUploadHandler extends FormHandlerBase<ProjectDocumentPageParams, MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator> {
  constructor() {
    super(ProjectDocumentsRoute, ["default"], [upload.single("attachment")]);
  }

  protected async getDto(context: IContext, params: ProjectDocumentPageParams, button: IFormButton, body: IFormBody, file: IFileWrapper): Promise<MultipleDocumentUploadDto> {
    return {
      files: [file],
      description: body.description
    };
  }

  protected async run(context: IContext, params: ProjectDocumentPageParams, button: IFormButton, dto: MultipleDocumentUploadDto): Promise<ILinkInfo> {
    await context.runCommand(new UploadProjectDocumentCommand(params.projectId, dto));
    return ProjectDocumentsRoute.getLink(params);
  }

  protected getStoreInfo(params: ProjectDocumentPageParams): { key: string, store: string } {
    return getProjectDocumentEditor(params.projectId, Configuration.maxFileSize);
  }

  protected createValidationResult(params: ProjectDocumentPageParams, dto: MultipleDocumentUploadDto) {
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration.maxFileSize, Configuration.maxUploadFileCount, false);
  }
}
