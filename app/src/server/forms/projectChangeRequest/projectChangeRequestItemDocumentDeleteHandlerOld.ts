import { IContext, ILinkInfo } from "@framework/types";
import { DeleteProjectChangeRequestDocumentOrItemDocument } from "@server/features/documents/deleteProjectChangeRequestDocumentOrItemDocument";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  ProjectChangeRequestPrepareItemFilesRoute,
  ProjectChangeRequestPrepareItemParams
} from "@ui/containers";
import { Results } from "@ui/validation";
import { getKey } from "@framework/util";

interface Document {
  id: string;
}

export class ProjectChangeRequestItemDocumentDeleteHandlerOld extends StandardFormHandlerBase<ProjectChangeRequestPrepareItemParams, Document, Results<{}>> {
  constructor() {
    super(ProjectChangeRequestPrepareItemFilesRoute, ["delete"]);
  }

  protected getDto(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, body: IFormBody) {
    return Promise.resolve({id: button.value});
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareItemParams, dto: Document) {
    return new Results(dto, false);
  }

  protected getStoreInfo(params: ProjectChangeRequestPrepareItemParams): {key: string, store: string} {
    return {
      key: getKey("pcrs", params.projectId, params.itemId),
      store:"multipleDocuments"
    };
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareItemParams, button: IFormButton, dto: Document): Promise<ILinkInfo> {
    const command = new DeleteProjectChangeRequestDocumentOrItemDocument(dto.id, params.projectId, params.itemId);
    await context.runCommand(command);
    return ProjectChangeRequestPrepareItemFilesRoute.getLink(params);
  }

}
