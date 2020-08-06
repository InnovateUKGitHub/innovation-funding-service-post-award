import { IContext, ILinkInfo } from "@framework/types";
import { Configuration } from "@server/features/common";
import { DeleteProjectChangeRequestDocumentOrItemDocument } from "@server/features/documents/deleteProjectChangeRequestDocumentOrItemDocument";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  PCRPrepareItemRoute,
  ProjectChangeRequestPrepareItemParams
} from "@ui/containers";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

interface Document extends MultipleDocumentUploadDto {
  id: string;
}

export class ProjectChangeRequestItemDocumentDeleteHandler extends StandardFormHandlerBase<ProjectChangeRequestPrepareItemParams, "multipleDocuments"> {
  constructor() {
    super(PCRPrepareItemRoute, ["delete"], "multipleDocuments");
  }

  protected getDto(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, body: IFormBody) {
    return Promise.resolve({id: button.value, files: []});
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareItemParams, dto: Document) {
    return new MultipleDocumentUpdloadDtoValidator(dto, Configuration.options, false, false, null);
  }

  protected getStoreKey(params: ProjectChangeRequestPrepareItemParams) {
    return storeKeys.getPcrKey(params.projectId, params.itemId);
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, dto: Document): Promise<ILinkInfo> {
    const command = new DeleteProjectChangeRequestDocumentOrItemDocument(dto.id, params.projectId, params.itemId);
    await context.runCommand(command);
    return PCRPrepareItemRoute.getLink(params);
  }

}
