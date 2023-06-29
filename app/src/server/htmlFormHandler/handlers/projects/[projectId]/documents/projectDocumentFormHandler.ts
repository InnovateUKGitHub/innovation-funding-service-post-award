import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { UploadProjectDocumentCommand } from "@server/features/documents/uploadProjectDocument";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { IFileWrapper } from "@framework/types/fileWapper";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { configuration } from "@server/features/common/config";
import {
  ProjectDocumentPageParams,
  ProjectDocumentsRoute,
} from "@ui/containers/pages/projects/documents/projectDocuments.page";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";

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
      partnerId: body.partnerId,
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
