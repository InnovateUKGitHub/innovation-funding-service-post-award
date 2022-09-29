import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { IContext, IFileWrapper, ILinkInfo } from "@framework/types";
import { configuration } from "@server/features/common";
import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";
import { IFormBody, IFormButton, MultipleFileFormHandlerBase } from "@server/forms/formHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/containers";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators";

export class ProjectChangeRequestItemDocumentUploadHandler extends MultipleFileFormHandlerBase<
  ProjectChangeRequestPrepareItemParams,
  "multipleDocuments"
> {
  constructor() {
    super(PCRPrepareItemRoute, ["uploadFile"], "multipleDocuments");
  }

  protected async getDto(
    context: IContext,
    params: ProjectChangeRequestPrepareItemParams,
    button: IFormButton,
    body: IFormBody,
    files: IFileWrapper[],
  ): Promise<MultipleDocumentUploadDto> {
    return {
      files,
      description: Number(body.description) || undefined,
    };
  }

  protected async run(
    context: IContext,
    params: ProjectChangeRequestPrepareItemParams,
    button: IFormButton,
    dto: MultipleDocumentUploadDto,
  ): Promise<ILinkInfo> {
    // Run command only if any files have been uploaded.
    if (dto.files.length) {
      await context.runCommand(
        new UploadProjectChangeRequestDocumentOrItemDocumentCommand(params.projectId, params.itemId, dto),
      );
    }

    return PCRPrepareItemRoute.getLink(params);
  }

  protected getStoreKey(params: ProjectChangeRequestPrepareItemParams) {
    return storeKeys.getPcrKey(params.projectId, params.itemId);
  }

  protected createValidationResult(
    params: ProjectChangeRequestPrepareItemParams,
    dto: MultipleDocumentUploadDto,
    button: IFormButton,
  ) {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, button.name === "uploadFile", true, null);
  }
}
