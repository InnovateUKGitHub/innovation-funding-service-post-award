import { DeleteProjectChangeRequestDocumentOrItemDocument } from "@server/features/documents/deleteProjectChangeRequestDocumentOrItemDocument";
import { IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { configuration } from "@server/features/common/config";
import {
  ProjectChangeRequestPrepareItemParams,
  PCRPrepareItemRoute,
} from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";

interface Document extends MultipleDocumentUploadDto {
  id: string;
}

export class ProjectChangeRequestItemDocumentDeleteHandler extends StandardFormHandlerBase<
  ProjectChangeRequestPrepareItemParams,
  "multipleDocuments"
> {
  constructor() {
    super(PCRPrepareItemRoute, ["delete"], "multipleDocuments");
  }

  protected getDto(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton) {
    return Promise.resolve({ id: button.value, files: [] });
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareItemParams, dto: Document) {
    return new MultipleDocumentUploadDtoValidator(dto, configuration.options, false, false, null);
  }

  protected getStoreKey(params: ProjectChangeRequestPrepareItemParams) {
    return storeKeys.getPcrKey(params.projectId, params.itemId);
  }

  protected async run(
    context: IContext,
    params: ProjectChangeRequestPrepareItemParams,
    button: IFormButton,
    dto: Document,
  ): Promise<ILinkInfo> {
    const command = new DeleteProjectChangeRequestDocumentOrItemDocument(dto.id, params.projectId, params.itemId);
    await context.runCommand(command);
    return PCRPrepareItemRoute.getLink(params);
  }
}
