import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { DocumentQueryBase } from "./documentQueryBase";

export class GetProjectDocumentQuery extends DocumentQueryBase {
  constructor(private readonly projectId: string, documentId: string) {
    super(documentId);
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.projectDocuments && auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected getRecordId(context: IContext): Promise<string | null> {
    return Promise.resolve(this.projectId);
  }
}
