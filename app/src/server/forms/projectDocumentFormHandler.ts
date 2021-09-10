import { configuration } from "@server/features/common";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators";
import { IContext, IFileWrapper, ILinkInfo } from "@framework/types";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { UploadProjectDocumentCommand } from "../features/documents/uploadProjectDocument";
import { ProjectDocumentPageParams, ProjectDocumentsRoute } from "../../ui/containers";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "./formHandlerBase";

export class ProjectDocumentUploadHandler extends MultipleFileFormHandlerBase<
  ProjectDocumentPageParams,
  "multipleDocuments"
> {
  constructor() {
    super(ProjectDocumentsRoute, ["default"], "multipleDocuments");
  }

  protected getDto(
    _context: IContext,
    _params: ProjectDocumentPageParams,
    _button: IFormButton,
    body: IFormBody,
    files: IFileWrapper[],
  ): Promise<MultipleDocumentUploadDto> {
    return Promise.resolve({
      files,
      description: Number(body.description) || undefined,
    });
  }

  protected async run(
    context: IContext,
    params: ProjectDocumentPageParams,
    _button: IFormButton,
    dto: MultipleDocumentUploadDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(new UploadProjectDocumentCommand(params.projectId, dto));

    return ProjectDocumentsRoute.getLink(params);
  }

  protected getStoreKey(params: ProjectDocumentPageParams) {
    return storeKeys.getProjectKey(params.projectId);
  }

  protected createValidationResult(
    _params: ProjectDocumentPageParams,
    dto: MultipleDocumentUploadDto,
  ): MultipleDocumentUploadDtoValidator {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, true, false, null);
  }
}
