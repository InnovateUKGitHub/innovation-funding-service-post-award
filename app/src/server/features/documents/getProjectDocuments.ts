import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { ISalesforceDocument } from "@server/repositories";
import { DocumentsQueryBase } from "./documentsQueryBase";

export class GetProjectDocumentsQuery extends DocumentsQueryBase {
  constructor(private readonly projectId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.projectDocuments && auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext) {
    return super.getDocumentsForEntityId(context, this.projectId);
  }

  getUrl(document: ISalesforceDocument) {
    return `/api/documents/projects/${this.projectId}/${document.Id}/content`;
  }
}
