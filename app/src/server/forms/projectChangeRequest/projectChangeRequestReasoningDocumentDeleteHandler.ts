import { IContext, ILinkInfo } from "@framework/types";
import { DeleteProjectChangeRequestDocumentOrItemDocument } from "@server/features/documents/deleteProjectChangeRequestDocumentOrItemDocument";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { ProjectChangeRequestPrepareReasoningParams, ProjectChangeRequestPrepareReasoningRoute } from "@ui/containers";
import { getProjectChangeRequestDocumentOrItemDocumentDeleteEditorStoreInfo } from "@ui/redux/selectors";
import { Results } from "@ui/validation";

interface Document {
  id: string;
}

export class ProjectChangeRequestReasoningDocumentDeleteHandler extends StandardFormHandlerBase<ProjectChangeRequestPrepareReasoningParams, Document, Results<{}>> {
  constructor() {
    super(ProjectChangeRequestPrepareReasoningRoute, ["delete"]);
  }

  protected getDto(context: IContext, params: ProjectChangeRequestPrepareReasoningParams, button: IFormButton, body: IFormBody) {
    return Promise.resolve({id: button.value});
  }

  protected createValidationResult(params: ProjectChangeRequestPrepareReasoningParams, dto: Document) {
    return new Results(dto, false);
  }

  protected getStoreInfo(params: ProjectChangeRequestPrepareReasoningParams): { key: string, store: string } {
    return getProjectChangeRequestDocumentOrItemDocumentDeleteEditorStoreInfo(params.pcrId, []);
  }

  protected async run(context: IContext, params: ProjectChangeRequestPrepareReasoningParams, button: IFormButton, dto: Document): Promise<ILinkInfo> {
    const command = new DeleteProjectChangeRequestDocumentOrItemDocument(dto.id, params.projectId, params.pcrId);
    await context.runCommand(command);
    return ProjectChangeRequestPrepareReasoningRoute.getLink(params);
  }
}
