import { IContext, ILinkInfo } from "@framework/types";
import { DeleteProjectChangeRequestDocumentOrItemDocument } from "@server/features/documents/deleteProjectChangeRequestDocumentOrItemDocument";
import { IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { PCRPrepareReasoningRoute, ProjectChangeRequestPrepareReasoningParams } from "@ui/containers";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators";
import { configuration } from "@server/features/common";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

interface Document extends MultipleDocumentUploadDto {
  id: string;
}

export class ProjectChangeRequestReasoningDocumentDeleteHandler extends StandardFormHandlerBase<
  ProjectChangeRequestPrepareReasoningParams,
  "multipleDocuments"
> {
  constructor() {
    super(PCRPrepareReasoningRoute, ["delete"], "multipleDocuments");
  }

  protected getDto(context: IContext, params: ProjectChangeRequestPrepareReasoningParams, button: IFormButton) {
    return Promise.resolve({ id: button.value, files: [] });
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareReasoningParams, dto: Document) {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, false, false, null);
  }

  protected getStoreKey(params: ProjectChangeRequestPrepareReasoningParams) {
    return storeKeys.getPcrKey(params.projectId, params.pcrId);
  }

  protected async run(
    context: IContext,
    params: ProjectChangeRequestPrepareReasoningParams,
    button: IFormButton,
    dto: Document,
  ): Promise<ILinkInfo> {
    const command = new DeleteProjectChangeRequestDocumentOrItemDocument(dto.id, params.projectId, params.pcrId);
    await context.runCommand(command);
    return PCRPrepareReasoningRoute.getLink(params);
  }
}
