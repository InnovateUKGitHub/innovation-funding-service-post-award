import { IContext, ILinkInfo } from "@framework/types";
import { DeleteProjectChangeRequestDocumentOrItemDocument } from "@server/features/documents/deleteProjectChangeRequestDocumentOrItemDocument";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { getKey } from "@framework/util";
import { PCRPrepareReasoningRoute, ProjectChangeRequestPrepareReasoningParams } from "@ui/containers";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { Configuration } from "@server/features/common";

interface Document extends MultipleDocumentUploadDto {
  id: string;
}

export class ProjectChangeRequestReasoningDocumentDeleteHandler extends StandardFormHandlerBase<ProjectChangeRequestPrepareReasoningParams, "multipleDocuments"> {
  constructor() {
    super(PCRPrepareReasoningRoute, ["delete"], "multipleDocuments");
  }

  protected getDto(context: IContext, params: ProjectChangeRequestPrepareReasoningParams, button: IFormButton, body: IFormBody) {
    return Promise.resolve({id: button.value, files: []});
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareReasoningParams, dto: Document) {
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration, false, false);
  }

  protected getStoreKey(params: ProjectChangeRequestPrepareReasoningParams) {
    return getKey("pcrs", params.projectId, params.pcrId);
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareReasoningParams, button: IFormButton, dto: Document): Promise<ILinkInfo> {
    const command = new DeleteProjectChangeRequestDocumentOrItemDocument(dto.id, params.projectId, params.pcrId);
    await context.runCommand(command);
    return PCRPrepareReasoningRoute.getLink(params);
  }
}
